// src/components/Hero.tsx - VERSION CORRECTE POUR VERCEL
import { useState, useEffect } from 'react';
import { ArrowRight, GraduationCap, FileText, Home } from 'lucide-react';
import { API_BASE_URL } from '../config/api'; // <-- AJOUT IMPORT

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

export function Hero({ setActiveSection }: HeroProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Utiliser Promise.allSettled pour gérer les erreurs partielles
      // AVANT : const [establishmentsResponse, housingResponse] = await Promise.allSettled([
      //   fetch('/api/establishments/stats'),
      //   fetch('/api/housing/stats')
      // ]);
      // APRÈS :
      const [establishmentsResponse, housingResponse] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/establishments/stats`),
        fetch(`${API_BASE_URL}/api/housing/stats`)
      ]);

      let establishmentStats = null;
      let housingStats = null;

      // Traiter la réponse des établissements
      if (establishmentsResponse.status === 'fulfilled') {
        const data = await establishmentsResponse.value.json();
        if (data.success) establishmentStats = data.data;
      }

      // Traiter la réponse des logements
      if (housingResponse.status === 'fulfilled') {
        const data = await housingResponse.value.json();
        if (data.success) housingStats = data.data;
      }

      // Si aucune donnée n'a été récupérée
      if (!establishmentStats && !housingStats) {
        throw new Error('Impossible de récupérer les statistiques');
      }

      // Calculer les statistiques avec des valeurs par défaut
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
      
      // Valeurs par défaut en cas d'erreur
      setStats({
        totalEstablishments: 50,
        establishmentsByType: [
          { type: 'university', count: 25 },
          { type: 'school', count: 15 },
          { type: 'institute', count: 10 }
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
    },
    {
      id: 'formalites',
      icon: FileText,
      title: 'Formalités',
      description: 'Visa étranger, carte de séjour et démarches administratives',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      id: 'loger',
      icon: Home,
      title: 'Se Loger',
      description: 'Trouvez votre logement étudiant au Sénégal',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  // Fonction utilitaire pour formater les nombres
  const formatNumber = (num: number): string => {
    if (num >= 1000) return `${Math.round(num / 1000)}+`;
    return num.toString();
  };

  // Fonction utilitaire pour calculer le pourcentage
  const calculatePercentage = (part: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  };

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl text-white mb-6">
              Bienvenue sur <span className="block mt-2">EtudeSénégal</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Votre guide complet pour étudier, s'installer et réussir au Sénégal
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setActiveSection('etudier')}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                Commencer
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white rounded-xl hover:bg-blue-500/30 transition-all border border-white/20">
                En savoir plus
              </button>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="rgb(248 250 252)"
            />
          </svg>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                onClick={() => setActiveSection(feature.id)}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer p-8 group hover:-translate-y-2"
              >
                <div className={`bg-gradient-to-br ${feature.color} w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-2xl text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center gap-2 text-blue-600 group-hover:gap-4 transition-all">
                  Découvrir
                  <ArrowRight size={18} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section - Dynamique */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Chargement des statistiques...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-yellow-600 mb-4">⚠️ {error}</div>
              <p className="text-gray-600">Affichage des statistiques par défaut</p>
            </div>
          ) : stats ? (
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {/* Établissements */}
              <div>
                <div className="text-4xl text-blue-600 mb-2">
                  {formatNumber(stats.totalEstablishments)}+
                </div>
                <div className="text-gray-600">Établissements</div>
                <div className="text-sm text-gray-400 mt-1">
                  {stats.establishmentsByType.length > 0 ? (
                    stats.establishmentsByType.map((type, index) => (
                      <span key={type.type}>
                        {type.count} {type.type}
                        {index < stats.establishmentsByType.length - 1 ? ', ' : ''}
                      </span>
                    ))
                  ) : (
                    'Chargement...'
                  )}
                </div>
              </div>
              
              {/* Reconnaissance CAMES */}
              <div>
                <div className="text-4xl text-indigo-600 mb-2">
                  {stats.camesRecognition.total > 0 ? 
                    `${calculatePercentage(stats.camesRecognition.recognized, stats.camesRecognition.total)}%` : 
                    '100%'
                  }
                </div>
                <div className="text-gray-600">Reconnus CAMES</div>
                <div className="text-sm text-gray-400 mt-1">
                  {stats.camesRecognition.recognized} sur {stats.camesRecognition.total}
                </div>
              </div>
              
              {/* Note moyenne */}
              <div>
                <div className="text-4xl text-purple-600 mb-2">
                  {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '4.5'}/5
                </div>
                <div className="text-gray-600">Note moyenne</div>
                <div className="text-sm text-gray-400 mt-1">
                  Basé sur les évaluations
                </div>
              </div>
              
              {/* Logements */}
              <div>
                <div className="text-4xl text-pink-600 mb-2">
                  {formatNumber(stats.totalHousing)}+
                </div>
                <div className="text-gray-600">Logements</div>
                <div className="text-sm text-gray-400 mt-1">
                  {stats.availableHousing} disponibles
                  <div className="mt-1">
                    {stats.avgPrice > 0 ? `~${stats.avgPrice.toLocaleString()} FCFA/mois` : ''}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Aucune donnée disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}