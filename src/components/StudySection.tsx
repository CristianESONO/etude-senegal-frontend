import { Building2, School, BookOpen, CheckCircle2, MapPin, Users, Search, Filter, Star, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api'; 

export function StudySection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [establishments, setEstablishments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEstablishments, setTotalEstablishments] = useState(0);
  const [limit] = useState(12); // Nombre d'établissements par page

  const establishmentTypes = [
    {
      type: 'university',
      label: 'Universités',
      icon: Building2,
      description: 'Établissements publics et privés offrant des formations pluridisciplinaires',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      type: 'school',
      label: 'Écoles Supérieures',
      icon: School,
      description: 'Formations spécialisées et professionnelles de haut niveau',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      type: 'institute',
      label: 'Instituts Spécialisés',
      icon: BookOpen,
      description: 'Formations techniques et professionnelles dans des domaines spécifiques',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const cities = ['Dakar', 'Saint-Louis', 'Thiès', 'Bambey', 'Ziguinchor'];

  // 🔄 CHARGEMENT DES DONNÉES DEPUIS L'API AVEC PAGINATION
  useEffect(() => {
    const fetchEstablishments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construire les paramètres de requête
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: limit.toString()
        });
        
        // Ajouter les filtres si présents
        if (searchQuery) params.append('search', searchQuery);
        if (selectedType !== 'all') params.append('type', selectedType);
        if (selectedCity !== 'all') params.append('location', selectedCity);
        
        const response = await fetch(`${API_BASE_URL}/api/establishments?${params}`); 
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Transformez les données de l'API pour correspondre à votre frontend
          const formattedEstablishments = data.data.map((est: any) => ({
            id: est._id,
            name: est.name,
            type: est.type,
            location: est.location,
            students: est.studentsCount ? `${est.studentsCount.toLocaleString()}+` : 'N/A',
            rating: est.rating || 0,
            programs: est.programs?.length || 0,
            description: est.description,
            isCAMESRecognized: est.isCAMESRecognized || false,
            contact: est.contact || {}
          }));
          
          setEstablishments(formattedEstablishments);
          setTotalPages(data.totalPages || 1);
          setTotalEstablishments(data.total || 0);
        } else {
          console.warn('API retourné success: false', data.message);
          // En cas d'erreur API, utiliser les données de secours
          throw new Error(data.message || 'Erreur API');
        }
      } catch (err: any) {
        console.error('Erreur de chargement:', err);
        setError('Impossible de charger les établissements. Vérifiez que le serveur backend est en marche.');
        
        // 🔄 FALLBACK: Utilisez les données statiques si l'API échoue
        const fallbackData = getFallbackData();
        const filteredFallback = filterFallbackData(fallbackData, searchQuery, selectedType, selectedCity);
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedFallback = filteredFallback.slice(startIndex, endIndex);
        
        setEstablishments(paginatedFallback);
        setTotalEstablishments(filteredFallback.length);
        setTotalPages(Math.ceil(filteredFallback.length / limit));
      } finally {
        setLoading(false);
      }
    };

    fetchEstablishments();
  }, [currentPage, searchQuery, selectedType, selectedCity, limit]);

  // Réinitialiser à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType, selectedCity]);

  // 📋 DONNÉES STATIQUES DE SECOURS
  const getFallbackData = () => {
    return [
      { id: 1, name: 'Université Cheikh Anta Diop (UCAD)', type: 'university', location: 'Dakar', students: '80,000+', rating: 4.8, programs: 45, description: '', isCAMESRecognized: true, contact: {} },
      { id: 2, name: 'Université Gaston Berger (UGB)', type: 'university', location: 'Saint-Louis', students: '20,000+', rating: 4.7, programs: 38, description: '', isCAMESRecognized: true, contact: {} },
      { id: 3, name: 'Université Alioune Diop', type: 'university', location: 'Bambey', students: '15,000+', rating: 4.5, programs: 28, description: '', isCAMESRecognized: true, contact: {} },
      { id: 4, name: 'Université Assane Seck', type: 'university', location: 'Ziguinchor', students: '12,000+', rating: 4.6, programs: 25, description: '', isCAMESRecognized: true, contact: {} },
      { id: 5, name: 'École Polytechnique de Thiès (EPT)', type: 'school', location: 'Thiès', students: '5,000+', rating: 4.9, programs: 12, description: '', isCAMESRecognized: true, contact: {} },
      { id: 6, name: 'École Supérieure Polytechnique (ESP)', type: 'school', location: 'Dakar', students: '3,000+', rating: 4.8, programs: 15, description: '', isCAMESRecognized: true, contact: {} },
      { id: 7, name: 'ENSUT', type: 'school', location: 'Dakar', students: '2,500+', rating: 4.7, programs: 8, description: '', isCAMESRecognized: true, contact: {} },
      { id: 8, name: 'École Nationale d\'Administration (ENA)', type: 'school', location: 'Dakar', students: '1,800+', rating: 4.9, programs: 6, description: '', isCAMESRecognized: true, contact: {} },
      { id: 9, name: 'Institut Africain de Management (IAM)', type: 'institute', location: 'Dakar', students: '1,500+', rating: 4.6, programs: 10, description: '', isCAMESRecognized: false, contact: {} },
      { id: 10, name: 'Institut Supérieur de Commerce', type: 'institute', location: 'Dakar', students: '2,000+', rating: 4.5, programs: 12, description: '', isCAMESRecognized: true, contact: {} },
      { id: 11, name: 'IFAGE', type: 'institute', location: 'Dakar', students: '1,200+', rating: 4.4, programs: 8, description: '', isCAMESRecognized: false, contact: {} },
      { id: 12, name: 'Institut Supérieur d\'Informatique (ISI)', type: 'institute', location: 'Dakar', students: '2,500+', rating: 4.7, programs: 9, description: '', isCAMESRecognized: true, contact: {} },
      { id: 13, name: 'Université de Thiès', type: 'university', location: 'Thiès', students: '8,000+', rating: 4.4, programs: 22, description: '', isCAMESRecognized: true, contact: {} },
      { id: 14, name: 'Université du Sine Saloum', type: 'university', location: 'Kaolack', students: '6,000+', rating: 4.3, programs: 18, description: '', isCAMESRecognized: true, contact: {} },
      { id: 15, name: 'École des Bibliothécaires', type: 'school', location: 'Dakar', students: '800+', rating: 4.6, programs: 4, description: '', isCAMESRecognized: true, contact: {} },
      { id: 16, name: 'Institut Supérieur de Management', type: 'institute', location: 'Dakar', students: '3,000+', rating: 4.5, programs: 14, description: '', isCAMESRecognized: true, contact: {} },
    ];
  };

  // 🔍 FILTRE DES DONNÉES DE SECOURS
  const filterFallbackData = (data: any[], search: string, type: string, city: string) => {
    return data.filter((est) => {
      const matchesSearch = search === '' || 
        est.name.toLowerCase().includes(search.toLowerCase()) || 
        est.location.toLowerCase().includes(search.toLowerCase());
      const matchesType = type === 'all' || est.type === type;
      const matchesCity = city === 'all' || est.location === city;
      
      return matchesSearch && matchesType && matchesCity;
    });
  };

  const getTypeInfo = (type: string) => {
    return establishmentTypes.find(t => t.type === type);
  };

  // 📊 STATISTIQUES EN TEMPS RÉEL
  const universitiesCount = establishments.filter(e => e.type === 'university').length;
  const schoolsCount = establishments.filter(e => e.type === 'school').length;
  const institutesCount = establishments.filter(e => e.type === 'institute').length;

  // 🔍 FONCTIONS DE PAGINATION
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Calcul des numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Afficher avec des ellipses
      if (currentPage <= 3) {
        // Pages 1, 2, 3, ..., dernière
        pageNumbers.push(1, 2, 3);
        if (totalPages > 4) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Première, ..., avant-dernière, dernière
        pageNumbers.push(1);
        if (totalPages > 4) pageNumbers.push('...');
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Première, ..., current-1, current, current+1, ..., dernière
        pageNumbers.push(1, '...');
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        if (currentPage + 2 < totalPages) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Calcul de l'affichage des résultats
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalEstablishments);

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">Étudier au Sénégal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les établissements d'enseignement supérieur reconnus par le CAMES
          </p>
          
          {!loading && !error && (
            <div className="mt-4 text-sm text-gray-500">
              {totalEstablishments} établissements disponibles • Page {currentPage}/{totalPages}
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher un établissement, une ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Loader2 className="animate-spin text-blue-500" size={20} />
              </div>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-2">Type d'établissement</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                  disabled={loading}
                >
                  <option value="all">Tous les types</option>
                  <option value="university">Universités</option>
                  <option value="school">Écoles Supérieures</option>
                  <option value="institute">Instituts Spécialisés</option>
                </select>
              </div>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-2">Ville</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                  disabled={loading}
                >
                  <option value="all">Toutes les villes</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-gray-600">
            <span className="text-blue-600 font-medium">{totalEstablishments}</span> établissement(s) au total
            {searchQuery || selectedType !== 'all' || selectedCity !== 'all' ? (
              <span className="text-sm text-gray-500 ml-2">
                (filtres actifs)
              </span>
            ) : null}
          </div>
        </div>

        {/* Hero Image - MODIFIÉ */}
        <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl">
          <ImageWithFallback
            src="/assets/ucad.jpg"
            alt="Université Cheikh Anta Diop (UCAD)"
            className="w-full h-96 object-cover"
          />
        </div>

        {/* CAMES Recognition Badge - MODIFIÉ POUR ÊTRE RESPONSIVE */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 sm:p-6 mb-16">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="bg-green-500 p-2 sm:p-3 rounded-lg self-center sm:self-start">
              <CheckCircle2 className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg sm:text-xl text-gray-900 mb-2">Reconnaissance CAMES</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-0">
                Tous les établissements listés sont reconnus par le Conseil Africain et Malgache pour l'Enseignement Supérieur (CAMES), 
                garantissant la qualité et la reconnaissance internationale de vos diplômes.
              </p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="bg-white px-3 py-1 sm:py-2 rounded-lg border min-w-[80px] sm:min-w-0">
                  <span className="font-medium">{universitiesCount}</span> universités
                </div>
                <div className="bg-white px-3 py-1 sm:py-2 rounded-lg border min-w-[80px] sm:min-w-0">
                  <span className="font-medium">{schoolsCount}</span> écoles supérieures
                </div>
                <div className="bg-white px-3 py-1 sm:py-2 rounded-lg border min-w-[80px] sm:min-w-0">
                  <span className="font-medium">{institutesCount}</span> instituts
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Establishments Grid */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl text-gray-900">Liste des établissements</h2>
            <div className="text-gray-600">
              Affichage <span className="font-medium text-blue-600">{startIndex}-{endIndex}</span> sur {totalEstablishments}
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="animate-spin mx-auto text-blue-500 mb-4" size={48} />
              <p className="text-xl text-gray-600">Chargement des établissements...</p>
              <p className="text-gray-400 mt-2">Page {currentPage} sur {totalPages}</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-amber-50 rounded-2xl border-2 border-amber-200">
              <div className="text-amber-600 mb-4">⚠️</div>
              <p className="text-xl text-gray-900 mb-2">Mode hors ligne activé</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-gray-500 text-sm">Vous visualisez des données statiques de démonstration.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Réessayer la connexion
              </button>
            </div>
          ) : establishments.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-xl text-gray-500">Aucun établissement trouvé</p>
              <p className="text-gray-400 mt-2">Essayez de modifier vos critères de recherche</p>
              {searchQuery || selectedType !== 'all' || selectedCity !== 'all' ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedCity('all');
                  }}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              ) : null}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {establishments.map((establishment) => {
                  const typeInfo = getTypeInfo(establishment.type);
                  const Icon = typeInfo?.icon || Building2;
                  
                  return (
                    <div
                      key={establishment.id}
                      className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-xl transition-all group"
                    >
                      <div className={`bg-gradient-to-r ${typeInfo?.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      
                      <h3 className="text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {establishment.name}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} className="text-blue-500" />
                          <span>{establishment.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users size={16} className="text-indigo-500" />
                          <span>{establishment.students} étudiants</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <BookOpen size={16} className="text-purple-500" />
                          <span>{establishment.programs} programmes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star size={16} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-gray-900">{establishment.rating.toFixed(1)}/5</span>
                        </div>
                        {establishment.isCAMESRecognized && (
                          <div className="flex items-center gap-2 text-green-600 text-sm">
                            <CheckCircle2 size={14} />
                            <span>Reconnu CAMES</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            // Redirection vers la page de détails
                            window.location.href = `/etablissements/${establishment.id}`;
                          }}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                          Voir détails
                        </button>
                        <button 
                          onClick={() => {
                            // Ajouter aux favoris (à implémenter plus tard)
                            console.log('Ajouter aux favoris:', establishment.id);
                          }}
                          className="px-4 py-2 border-2 border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                        >
                          <Star size={18} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* PAGINATION CONTROLS */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-200">
                  <div className="text-gray-600">
                    Page {currentPage} sur {totalPages} • {totalEstablishments} établissements
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Bouton précédent */}
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        currentPage === 1
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ChevronLeft size={18} />
                      Précédent
                    </button>

                    {/* Numéros de page */}
                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNumber, index) => (
                        pageNumber === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                            ...
                          </span>
                        ) : (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageClick(pageNumber as number)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        )
                      ))}
                    </div>

                    {/* Bouton suivant */}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        currentPage === totalPages
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      Suivant
                      <ChevronRight size={18} />
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {limit} établissements par page
                  </div>
                </div>
              )}
            </>
          )}
        </div>

       {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl mb-4">Prêt à commencer votre parcours académique ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Contactez-nous pour plus d'informations sur les admissions et les programmes disponibles
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="whatsapp://send?phone=711457304"
              onClick={(e) => {
                // Fallback pour desktop
                if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                  e.preventDefault();
                  window.open('https://wa.me/711457304', '_blank');
                }
              }}
              className="px-8 py-4 bg-[#25D366] text-white rounded-xl hover:bg-[#128C7E] transition-all shadow-lg flex items-center gap-3"
            >
              {/* Icône WhatsApp */}
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.032 0c-6.626 0-12 5.372-12 12 0 2.126.553 4.144 1.527 5.946l-1.458 5.383 5.524-1.458c1.757.951 3.756 1.465 5.894 1.465 6.627 0 12-5.372 12-12s-5.373-12-12-12zm5.633 17.018c-.329.925-1.61 1.689-2.635 1.761-.815.057-1.839-.205-3.475-.75-2.373-.795-4.294-2.857-4.855-5.116-.374-1.506.022-2.758.824-3.642.467-.514 1.12-.803 1.814-.803.246 0 .486.039.705.113.374.125.714.428.936.811.329.577.369.738.722 1.353.277.479.466.86.668 1.176.21.33.425.669.63.949.229.309.464.64.766.94.301.299.593.446.973.446.146 0 .29-.019.429-.057.773-.21 1.462-.925 1.69-1.699.21-.725.084-1.34-.374-1.861-.319-.366-.738-.596-1.169-.596-.146 0-.291.039-.425.113-.104.057-.192.104-.291.104-.126 0-.317-.15-.483-.33-.41-.442-.75-1.028-1.048-1.703-.226-.524-.016-1.297.525-1.716.301-.236.648-.354.997-.354 1.247 0 2.326.842 2.782 1.923.374.876.412 1.89.105 2.817z"/>
              </svg>
              Nous contacter
            </a>
            {totalEstablishments > 0 && (
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-8 py-4 bg-blue-700 text-white rounded-xl hover:bg-blue-800 transition-all"
              >
                Voir tous les établissements
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}