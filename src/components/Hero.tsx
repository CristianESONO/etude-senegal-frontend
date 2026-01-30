import { useState, useEffect } from 'react';
import { ArrowRight, GraduationCap, FileText, Home, Sparkles, Globe, MapPin, Heart, Award, Users, TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { motion } from 'framer-motion'; // Changé de 'motion/react' à 'framer-motion'

interface HeroProps {
  setActiveSection: (section: string) => void;
}

interface StatsData {
  totalEstablishments: number;
  establishmentsByType: Array<{ type: string; count: number }>;
  avgRating: number;
  camesRecognition: { recognized: number; total: number };
  totalHousing: number;
  availableHousing: number;
  avgPrice: number;
}

// Fonctions utilitaires DÉPLACÉES EN HAUT
const formatNumber = (num: number): string => {
  if (num >= 1000) return `${Math.round(num / 1000)}+`;
  return num.toString();
};

const calculatePercentage = (part: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
};

export function Hero({ setActiveSection }: HeroProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [establishmentsResponse, housingResponse] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/establishments/stats`),
        fetch(`${API_BASE_URL}/api/housing/stats`)
      ]);

      let establishmentStats = null;
      let housingStats = null;

      if (establishmentsResponse.status === 'fulfilled') {
        const data = await establishmentsResponse.value.json();
        if (data.success) establishmentStats = data.data;
      }

      if (housingResponse.status === 'fulfilled') {
        const data = await housingResponse.value.json();
        if (data.success) housingStats = data.data;
      }

      if (!establishmentStats && !housingStats) {
        throw new Error('Impossible de récupérer les statistiques');
      }

      const totalEstablishments = establishmentStats?.stats?.totalEstablishments || 0;
      const camesStats = establishmentStats?.camesRecognition || [];
      
      const recognizedCount = camesStats.find((item: any) => item._id === true)?.count || 0;
      const totalCames = camesStats.reduce((acc: number, item: any) => acc + (item.count || 0), 0);
      
      const housingTotal = housingStats?.total?.total || 0;
      const housingAvailable = housingStats?.total?.totalAvailable || 0;
      const avgPrice = housingStats?.total?.avgPrice || 0;

      setStats({
        totalEstablishments,
        establishmentsByType: establishmentStats?.types || [],
        avgRating: establishmentStats?.stats?.avgRatingOverall || 0,
        camesRecognition: {
          recognized: recognizedCount,
          total: totalCames
        },
        totalHousing: housingTotal,
        availableHousing: housingAvailable,
        avgPrice: Math.round(avgPrice)
      });

    } catch (err) {
      console.error('Erreur lors de la récupération des statistiques:', err);
      setError('Impossible de charger les statistiques. Utilisation des valeurs par défaut.');
      
      setStats({
        totalEstablishments: 50,
        establishmentsByType: [
          { type: 'université', count: 25 },
          { type: 'école', count: 15 },
          { type: 'institut', count: 10 }
        ],
        avgRating: 4.2,
        camesRecognition: { recognized: 45, total: 50 },
        totalHousing: 1000,
        availableHousing: 850,
        avgPrice: 75000
      });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      id: 'etudier',
      icon: GraduationCap,
      title: 'Étudier',
      description: 'Découvrez les établissements supérieurs reconnus par le CAMES',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-600/90 to-cyan-600/90',
      emoji: '🎓',
    },
    {
      id: 'formalites',
      icon: FileText,
      title: 'Formalités',
      description: 'Visa étranger, carte de séjour et démarches administratives',
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-600/90 to-purple-600/90',
      emoji: '📋',
    },
    {
      id: 'loger',
      icon: Home,
      title: 'Se Loger',
      description: 'Trouvez votre logement étudiant au Sénégal',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-600/90 to-pink-600/90',
      emoji: '🏠',
    },
  ];

  const dynamicStats = stats ? [
    {
      value: `${formatNumber(stats.totalEstablishments)}+`,
      label: 'Établissements',
      emoji: '🎓',
      color: 'from-blue-500 to-cyan-500',
      description: stats.establishmentsByType.map(t => `${t.count} ${t.type}`).join(', ') || 'Universités, Écoles, Instituts'
    },
    {
      value: `${calculatePercentage(stats.camesRecognition.recognized, stats.camesRecognition.total)}%`,
      label: 'Reconnus CAMES',
      emoji: '✨',
      color: 'from-indigo-500 to-purple-500',
      description: `${stats.camesRecognition.recognized}/${stats.camesRecognition.total} établissements`
    },
    {
      value: `${formatNumber(stats.totalHousing)}+`,
      label: 'Logements',
      emoji: '🏠',
      color: 'from-purple-500 to-pink-500',
      description: `${stats.availableHousing} disponibles • ~${stats.avgPrice.toLocaleString()} FCFA/mois`
    },
    {
      value: `${stats.avgRating.toFixed(1)}/5`,
      label: 'Note moyenne',
      emoji: '⭐',
      color: 'from-pink-500 to-rose-500',
      description: 'Basé sur les évaluations'
    },
  ] : [
    {
      value: '50+',
      label: 'Établissements',
      emoji: '🎓',
      color: 'from-blue-500 to-cyan-500',
      description: 'Universités, Écoles, Instituts'
    },
    {
      value: '90%',
      label: 'Reconnus CAMES',
      emoji: '✨',
      color: 'from-indigo-500 to-purple-500',
      description: '45/50 établissements'
    },
    {
      value: '1000+',
      label: 'Logements',
      emoji: '🏠',
      color: 'from-purple-500 to-pink-500',
      description: '850 disponibles • ~75,000 FCFA/mois'
    },
    {
      value: '4.2/5',
      label: 'Note moyenne',
      emoji: '⭐',
      color: 'from-pink-500 to-rose-500',
      description: 'Basé sur les évaluations'
    },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-20 -left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full bg-gradient-to-br from-blue-900/95 via-purple-900/90 to-pink-900/95"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-purple-500/10 to-transparent" />
        </div>
        
        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 z-10">
          <div className="text-center">
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-xl opacity-60 animate-pulse" />
                <div className="relative px-8 py-3 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-full shadow-2xl">
                  <span className="text-gray-900 font-bold text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Statistiques en temps réel
                    <Sparkles className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
                Bienvenue sur
                <motion.span
                  className="block mt-4 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  EtudeSénégal
                </motion.span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-2xl md:text-3xl text-blue-100 max-w-4xl mx-auto mb-12 font-light leading-relaxed"
            >
              Votre plateforme complète pour <span className="font-semibold text-yellow-300">étudier</span>, 
              <span className="font-semibold text-pink-300"> s'installer</span> et 
              <span className="font-semibold text-purple-300"> réussir</span> au Sénégal 🇸🇳
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-6 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveSection('etudier')}
                className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-gray-900 font-bold text-lg rounded-2xl shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  Commencer l'aventure
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white font-bold text-lg rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all shadow-xl"
              >
                <span className="flex items-center gap-3">
                  <Globe className="w-6 h-6" />
                  Découvrir le Sénégal
                </span>
              </motion.button>
            </motion.div>

            {/* Floating Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="mt-20 flex flex-wrap gap-6 justify-center"
            >
              {loading ? (
                <div className="text-white flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Chargement des statistiques...
                </div>
              ) : error ? (
                <div className="text-yellow-300">{error}</div>
              ) : (
                dynamicStats.slice(0, 3).map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white font-semibold"
                  >
                    {stat.value} {stat.label}
                  </motion.div>
                ))
              )}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="rgb(248 250 252)"
            />
          </svg>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="relative bg-gradient-to-b from-slate-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Explorez nos services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tout ce dont vous avez besoin pour réussir votre projet d'études au Sénégal
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  onClick={() => setActiveSection(feature.id)}
                  onMouseEnter={() => setHoveredCard(feature.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group relative cursor-pointer"
                >
                  {/* Glow Effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
                  
                  {/* Card */}
                  <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden h-full">
                    {/* Image Section with Overlay */}
                    <div className="relative h-64 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor}`} />
                      
                      {/* Floating Icon */}
                      <motion.div
                        animate={{ 
                          y: hoveredCard === feature.id ? -10 : 0,
                          rotate: hoveredCard === feature.id ? 5 : 0
                        }}
                        className="absolute top-6 left-6"
                      >
                        <div className="relative">
                          <div className="absolute inset-0 bg-white rounded-2xl blur-md" />
                          <div className="relative bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl">
                            <span className="text-3xl">{feature.emoji}</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Top Right Badge */}
                      <div className="absolute top-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                        <span className="text-white font-semibold text-sm">Explorer</span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-8">
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {feature.description}
                      </p>
                      
                      <div
                        className={`flex items-center gap-3 text-transparent bg-gradient-to-r ${feature.color} bg-clip-text font-bold text-lg`}
                      >
                        Découvrir maintenant
                        <ArrowRight className={`w-5 h-5 bg-gradient-to-r ${feature.color} text-blue-600`} />
                      </div>
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                      <Icon className="w-full h-full" strokeWidth={1} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Section with Dynamic Data */}
      <div className="relative bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              EtudeSénégal en chiffres
            </h2>
            <p className="text-xl text-gray-600">
              Données actualisées en temps réel
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Chargement des données...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-3 text-yellow-600">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              <p className="text-gray-500 mt-2">Affichage des données par défaut</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-8">
              {dynamicStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="relative group"
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-all`} />
                  
                  {/* Card */}
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 group-hover:border-transparent group-hover:shadow-2xl transition-all">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-4xl">{stat.emoji}</span>
                    </div>
                    <div className={`text-6xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}>
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-bold text-lg mb-2">{stat.label}</div>
                    <div className="text-gray-500 text-sm">{stat.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-40" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
            Prêt à réaliser vos rêves ?
          </h2>
          
          <p className="text-2xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Rejoignez des milliers d'étudiants qui ont choisi le Sénégal pour construire leur avenir
          </p>

          <div className="flex flex-wrap gap-6 justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveSection('etudier')}
              className="group relative px-12 py-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-black text-xl rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-3">
                Démarrer maintenant
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <ArrowRight className="w-7 h-7" />
                </motion.div>
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-6 bg-white/20 backdrop-blur-xl text-white font-black text-xl rounded-2xl border-2 border-white/40 hover:bg-white/30 transition-all shadow-xl"
            >
              <span className="flex items-center gap-3">
                <MapPin className="w-7 h-7" />
                Voir la carte
              </span>
            </motion.button>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 flex flex-wrap gap-8 justify-center items-center"
          >
            {['🏆 CAMES', '⭐ 5.0/5', '🔒 100% Sécurisé', '✅ Vérifié'].map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1, y: -5 }}
                className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/30 text-white font-bold"
              >
                {badge}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}