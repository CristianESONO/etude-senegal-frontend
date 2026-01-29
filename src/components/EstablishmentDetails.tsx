// src/components/EstablishmentDetails.tsx - VERSION CORRECTE POUR VERCEL
import { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Users, BookOpen, Star, CheckCircle2, 
  Phone, Mail, Globe, ArrowLeft, Calendar, GraduationCap, Award,
  ExternalLink, Globe2, Layers, Target, MessageCircle,
  Facebook, Twitter, Linkedin, Instagram, Share2, Heart
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { API_BASE_URL } from '../config/api'; // <-- AJOUT IMPORT

export function EstablishmentDetails() {
  // Récupérer l'ID depuis l'URL
  const establishmentId = window.location.pathname.split('/').pop() || '';
  const [establishment, setEstablishment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'contact' | 'reviews'>('overview');
  
  // États pour les établissements similaires
  const [similarEstablishments, setSimilarEstablishments] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [currentSimilarPage, setCurrentSimilarPage] = useState(0);
  const itemsPerSlide = 3; // Nombre d'établissements par slide

  useEffect(() => {
    const fetchEstablishmentDetails = async () => {
      try {
        setLoading(true);
        // AVANT : const response = await fetch(`/api/establishments/${establishmentId}`);
        // APRÈS :
        const response = await fetch(`${API_BASE_URL}/api/establishments/${establishmentId}`);
        
        if (!response.ok) {
          throw new Error('Établissement non trouvé');
        }
        
        const data = await response.json();
        
        if (data.success) {
          const establishmentData = data.data;
          setEstablishment({
            id: establishmentData._id,
            name: establishmentData.name,
            type: establishmentData.type,
            location: establishmentData.location,
            description: establishmentData.description,
            studentsCount: establishmentData.studentsCount,
            rating: establishmentData.rating,
            programs: establishmentData.programs || [],
            images: establishmentData.images || [],
            isCAMESRecognized: establishmentData.isCAMESRecognized,
            contact: establishmentData.contact || {},
            coordinates: establishmentData.coordinates,
            createdAt: establishmentData.createdAt,
            updatedAt: establishmentData.updatedAt
          });
          
          // Vérifier si c'est un favori
          checkIfFavorite(establishmentData._id);
        } else {
          throw new Error(data.message);
        }
      } catch (err: any) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (establishmentId) {
      fetchEstablishmentDetails();
    }
  }, [establishmentId]);

  // Fonction pour charger les établissements similaires
  useEffect(() => {
    const fetchSimilarEstablishments = async () => {
      if (!establishment?.type) return;
      
      try {
        setLoadingSimilar(true);
        // Exclure l'établissement actuel des résultats
        // AVANT : const response = await fetch(`/api/establishments?type=${establishment.type}&limit=9&exclude=${establishment.id}`);
        // APRÈS :
        const response = await fetch(`${API_BASE_URL}/api/establishments?type=${establishment.type}&limit=9&exclude=${establishment.id}`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            // Filtrer pour exclure l'établissement actuel (au cas où l'API ne le ferait pas)
            const filtered = data.data.filter((est: any) => 
              est._id !== establishment.id && est._id !== establishmentId
            );
            setSimilarEstablishments(filtered);
          }
        }
      } catch (error) {
        console.error('Erreur chargement établissements similaires:', error);
      } finally {
        setLoadingSimilar(false);
      }
    };

    if (establishment) {
      fetchSimilarEstablishments();
    }
  }, [establishment, establishmentId]);

  const checkIfFavorite = async (id: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return;
      
      // AVANT : const response = await fetch('/api/users/favorites', {
      // APRÈS :
      const response = await fetch(`${API_BASE_URL}/api/users/favorites`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.favorites?.establishments) {
          const isFav = data.favorites.establishments.some((fav: any) => 
            fav._id === id || fav === id
          );
          setIsFavorite(isFav);
        }
      }
    } catch (error) {
      console.error('Erreur vérification favoris:', error);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleToggleFavorite = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        // Si pas connecté, rediriger vers login
        window.location.href = `/login?redirect=/etablissements/${establishmentId}`;
        return;
      }
      
      // AVANT : const response = await fetch(`/api/users/favorites/establishments/${establishmentId}`, {
      // APRÈS :
      const response = await fetch(`${API_BASE_URL}/api/users/favorites/establishments/${establishmentId}`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setIsFavorite(!isFavorite);
        }
      }
    } catch (error) {
      console.error('Erreur favoris:', error);
    }
  };

  // Fonctions de navigation du carrousel
  const handleNextSimilar = () => {
    const maxPage = Math.ceil(similarEstablishments.length / itemsPerSlide) - 1;
    if (currentSimilarPage < maxPage) {
      setCurrentSimilarPage(prev => prev + 1);
    }
  };

  const handlePrevSimilar = () => {
    if (currentSimilarPage > 0) {
      setCurrentSimilarPage(prev => prev - 1);
    }
  };

  // Fonction pour obtenir les labels par type
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      university: 'Université',
      school: 'École Supérieure',
      institute: 'Institut Spécialisé'
    };
    return labels[type] || type;
  };

  // Fonction pour obtenir les couleurs par type
  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      university: 'bg-blue-100 text-blue-800',
      school: 'bg-purple-100 text-purple-800',
      institute: 'bg-green-100 text-green-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des détails de l'établissement...</p>
        </div>
      </div>
    );
  }

  if (error || !establishment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Établissement non trouvé</h1>
          <p className="text-gray-600 mb-6">{error || "L'établissement demandé n'existe pas ou a été supprimé."}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/etudier'}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Retour aux établissements
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft size={20} />
                <span>Retour</span>
              </button>
              
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
                <a href="/" className="hover:text-blue-600">Étudier au Sénégal</a>
                <span>›</span>
                <a href="/etudier" className="hover:text-blue-600">Établissements</a>
                <span>›</span>
                <span className="font-medium text-gray-900 truncate max-w-xs">{establishment.name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition-all ${
                  isFavorite 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
                title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
              >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
              </button>
              
              <a 
                href={`https://wa.me/711457304?text=Bonjour,%20je%20m'intéresse%20à%20l'établissement%20${encodeURIComponent(establishment.name)}%20(${getTypeLabel(establishment.type)})%20à%20${establishment.location}.%20Pouvez-vous%20m'en%20dire%20plus%20?`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.032 0c-6.626 0-12 5.372-12 12 0 2.126.553 4.144 1.527 5.946l-1.458 5.383 5.524-1.458c1.757.951 3.756 1.465 5.894 1.465 6.627 0 12-5.372 12-12s-5.373-12-12-12zm5.633 17.018c-.329.925-1.61 1.689-2.635 1.761-.815.057-1.839-.205-3.475-.75-2.373-.795-4.294-2.857-4.855-5.116-.374-1.506.022-2.758.824-3.642.467-.514 1.12-.803 1.814-.803.246 0 .486.039.705.113.374.125.714.428.936.811.329.577.369.738.722 1.353.277.479.466.86.668 1.176.21.33.425.669.63.949.229.309.464.64.766.94.301.299.593.446.973.446.146 0 .29-.019.429-.057.773-.21 1.462-.925 1.69-1.699.21-.725.084-1.34-.374-1.861-.319-.366-.738-.596-1.169-.596-.146 0-.291.039-.425.113-.104.057-.192.104-.291.104-.126 0-.317-.15-.483-.33-.41-.442-.75-1.028-1.048-1.703-.226-.524-.016-1.297.525-1.716.301-.236.648-.354.997-.354 1.247 0 2.326.842 2.782 1.923.374.876.412 1.89.105 2.817z"/>
                </svg>
                Contacter sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Image hero et infos rapides */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwc2VuZWdhbHxlbnwxfHx8fDE3NjYyNzIyOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt={establishment.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(establishment.type)}`}>
                      {getTypeLabel(establishment.type)}
                    </span>
                    {establishment.isCAMESRecognized && (
                      <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        Reconnu CAMES
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{establishment.name}</h1>
                  
                  <div className="flex flex-wrap items-center gap-4 text-lg">
                    <div className="flex items-center gap-2">
                      <MapPin size={20} className="text-blue-300" />
                      <span>{establishment.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} className="text-indigo-300" />
                      <span>{establishment.studentsCount?.toLocaleString() || 0} étudiants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={20} className="text-yellow-300 fill-yellow-300" />
                      <span className="font-bold">{establishment.rating?.toFixed(1) || 0}/5</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  {establishment.contact?.website && (
                    <a
                      href={establishment.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Site web
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex overflow-x-auto gap-1 mb-8 bg-white rounded-2xl shadow-xl p-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Building2 className="inline-block mr-2" size={18} />
            Aperçu
          </button>
          <button
            onClick={() => setActiveTab('programs')}
            className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'programs'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="inline-block mr-2" size={18} />
            Programmes ({establishment.programs?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'contact'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Phone className="inline-block mr-2" size={18} />
            Contact
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
              activeTab === 'reviews'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="inline-block mr-2" size={18} />
            Avis
          </button>
        </div>

        {/* Contenu des tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="text-blue-600" size={24} />
                  Description
                </h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {establishment.description || "Aucune description disponible pour cet établissement."}
                  </p>
                </div>
              </div>

              {/* Statistiques détaillées */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistiques détaillées</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                    <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="text-white" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {establishment.studentsCount?.toLocaleString() || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600">Étudiants inscrits</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 text-center">
                    <div className="bg-indigo-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="text-white" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {establishment.programs?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Programmes</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                    <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="text-white" size={24} fill="white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {establishment.rating?.toFixed(1) || 'N/A'}/5
                    </div>
                    <div className="text-sm text-gray-600">Note moyenne</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                    <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Award className="text-white" size={24} />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {establishment.isCAMESRecognized ? 'Oui' : 'Non'}
                    </div>
                    <div className="text-sm text-gray-600">Reconnaissance CAMES</div>
                  </div>
                </div>
              </div>

              {/* Informations générales */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Informations générales</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="text-blue-600 flex-shrink-0" size={20} />
                      <div>
                        <div className="text-sm text-gray-600">Localisation</div>
                        <div className="font-medium">{establishment.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Globe2 className="text-green-600 flex-shrink-0" size={20} />
                      <div>
                        <div className="text-sm text-gray-600">Type d'établissement</div>
                        <div className="font-medium">{getTypeLabel(establishment.type)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Calendar className="text-purple-600 flex-shrink-0" size={20} />
                      <div>
                        <div className="text-sm text-gray-600">Dernière mise à jour</div>
                        <div className="font-medium">{formatDate(establishment.updatedAt)}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                      <Target className="text-orange-600 flex-shrink-0" size={20} />
                      <div>
                        <div className="text-sm text-gray-600">Statut CAMES</div>
                        <div className="font-medium">
                          {establishment.isCAMESRecognized ? (
                            <span className="text-green-600">Reconnu ✅</span>
                          ) : (
                            <span className="text-gray-600">Non reconnu</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'programs' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Programmes d'études disponibles</h2>
              
              {establishment.programs?.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {establishment.programs.map((program: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                    >
                      <GraduationCap className="text-blue-600 mt-1 flex-shrink-0" size={20} />
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {program}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Programme disponible à {establishment.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <BookOpen className="text-gray-400 mx-auto mb-4" size={48} />
                  <p className="text-lg text-gray-500">Aucun programme disponible</p>
                  <p className="text-gray-400 mt-2">
                    Les informations sur les programmes seront bientôt disponibles
                  </p>
                </div>
              )}
              
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Comment postuler ?</h3>
                <p className="text-gray-700 mb-4">
                  Pour postuler à l'un de ces programmes, contactez directement l'établissement 
                  ou utilisez notre service d'accompagnement gratuit.
                </p>
                <a 
                  href={`https://wa.me/711457304?text=Bonjour,%20je%20souhaite%20m'inscrire%20à%20${encodeURIComponent(establishment.name)}%20et%20j'ai%20besoin%20d'aide%20pour%20les%20démarches%20d'inscription.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 justify-center"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.032 0c-6.626 0-12 5.372-12 12 0 2.126.553 4.144 1.527 5.946l-1.458 5.383 5.524-1.458c1.757.951 3.756 1.465 5.894 1.465 6.627 0 12-5.372 12-12s-5.373-12-12-12zm5.633 17.018c-.329.925-1.61 1.689-2.635 1.761-.815.057-1.839-.205-3.475-.75-2.373-.795-4.294-2.857-4.855-5.116-.374-1.506.022-2.758.824-3.642.467-.514 1.12-.803 1.814-.803.246 0 .486.039.705.113.374.125.714.428.936.811.329.577.369.738.722 1.353.277.479.466.86.668 1.176.21.33.425.669.63.949.229.309.464.64.766.94.301.299.593.446.973.446.146 0 .29-.019.429-.057.773-.21 1.462-.925 1.69-1.699.21-.725.084-1.34-.374-1.861-.319-.366-.738-.596-1.169-.596-.146 0-.291.039-.425.113-.104.057-.192.104-.291.104-.126 0-.317-.15-.483-.33-.41-.442-.75-1.028-1.048-1.703-.226-.524-.016-1.297.525-1.716.301-.236.648-.354.997-.354 1.247 0 2.326.842 2.782 1.923.374.876.412 1.89.105 2.817z"/>
                  </svg>
                  Demander de l'aide pour l'inscription
                </a>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Coordonnées et contact</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Informations de contact */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Informations de contact</h3>
                  
                  <div className="space-y-4">
                    {establishment.contact?.email && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                        <Mail className="text-indigo-600 flex-shrink-0" size={20} />
                        <div>
                          <div className="text-sm text-gray-600">Email</div>
                          <a 
                            href={`mailto:${establishment.contact.email}`}
                            className="font-medium text-gray-900 group-hover:text-indigo-600 transition-colors"
                          >
                            {establishment.contact.email}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {establishment.contact?.phone && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                        <Phone className="text-green-600 flex-shrink-0" size={20} />
                        <div>
                          <div className="text-sm text-gray-600">Téléphone</div>
                          <a 
                            href={`tel:${establishment.contact.phone}`}
                            className="font-medium text-gray-900 group-hover:text-green-600 transition-colors"
                          >
                            {establishment.contact.phone}
                          </a>
                        </div>
                      </div>
                    )}
                    
                    {establishment.contact?.website && (
                      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group">
                        <Globe className="text-blue-600 flex-shrink-0" size={20} />
                        <div>
                          <div className="text-sm text-gray-600">Site web</div>
                          <a 
                            href={establishment.contact.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1"
                          >
                            Visiter le site
                            <ExternalLink size={14} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Adresse */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Localisation</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-red-600 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <div className="font-medium text-gray-900">{establishment.name}</div>
                          <div className="text-gray-600 mt-1">{establishment.location}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Carte (placeholder) */}
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="text-gray-400 mx-auto mb-2" size={32} />
                        <p className="text-gray-500">Carte de localisation</p>
                        <p className="text-sm text-gray-400">{establishment.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Réseaux sociaux */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suivre sur les réseaux</h3>
                <div className="flex gap-3">
                  <button className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors">
                    <Facebook size={20} />
                  </button>
                  <button className="p-3 bg-sky-100 text-sky-600 rounded-xl hover:bg-sky-200 transition-colors">
                    <Twitter size={20} />
                  </button>
                  <button className="p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                    <Linkedin size={20} />
                  </button>
                  <button className="p-3 bg-pink-100 text-pink-600 rounded-xl hover:bg-pink-200 transition-colors">
                    <Instagram size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Avis et évaluations</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Note globale */}
                <div className="md:col-span-1">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {establishment.rating?.toFixed(1) || 'N/A'}
                    </div>
                    <div className="flex justify-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={`mx-0.5 ${
                            i < Math.floor(establishment.rating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-600">{establishment.studentsCount?.toLocaleString() || '0'} avis</p>
                  </div>
                </div>
                
                {/* Détail des notes */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-xl p-6 border-2 border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Détail des notes</h3>
                    
                    <div className="space-y-3">
                      {['5 étoiles', '4 étoiles', '3 étoiles', '2 étoiles', '1 étoile'].map((label, index) => (
                        <div key={label} className="flex items-center gap-3">
                          <div className="w-20 text-sm text-gray-600">{label}</div>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${(5 - index) * 20}%` }}
                            />
                          </div>
                          <div className="w-10 text-sm text-gray-900 text-right">
                            {Math.round((5 - index) * 20)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Avis récents */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Avis récents</h3>
                
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-medium text-gray-900">Étudiant anonyme</div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < 4 
                                    ? 'text-yellow-400 fill-yellow-400' 
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">Il y a 2 mois</div>
                      </div>
                      <p className="text-gray-700">
                        Excellente formation avec des professeurs compétents. 
                        L'infrastructure est moderne et bien entretenue.
                      </p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
                    Voir tous les avis
                  </button>
                </div>
              </div>
              
              {/* Ajouter un avis */}
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Partagez votre expérience</h3>
                <p className="text-gray-700 mb-4">
                  Vous avez étudié dans cet établissement ? Partagez votre avis pour aider 
                  les futurs étudiants à faire leur choix.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all">
                  Ajouter un avis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Actions et CTA */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl mb-4">Besoin d'aide pour postuler ?</h2>
            <p className="text-blue-100 mb-6">
              Notre équipe d'experts peut vous accompagner dans toutes vos démarches d'inscription.
            </p>
            <a 
              href={`https://wa.me/711457304?text=Bonjour,%20je%20souhaite%20postuler%20à%20${encodeURIComponent(establishment.name)}%20et%20j'aimerais%20bénéficier%20d'un%20accompagnement%20personnalisé.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-medium flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.032 0c-6.626 0-12 5.372-12 12 0 2.126.553 4.144 1.527 5.946l-1.458 5.383 5.524-1.458c1.757.951 3.756 1.465 5.894 1.465 6.627 0 12-5.372 12-12s-5.373-12-12-12zm5.633 17.018c-.329.925-1.61 1.689-2.635 1.761-.815.057-1.839-.205-3.475-.75-2.373-.795-4.294-2.857-4.855-5.116-.374-1.506.022-2.758.824-3.642.467-.514 1.12-.803 1.814-.803.246 0 .486.039.705.113.374.125.714.428.936.811.329.577.369.738.722 1.353.277.479.466.86.668 1.176.21.33.425.669.63.949.229.309.464.64.766.94.301.299.593.446.973.446.146 0 .29-.019.429-.057.773-.21 1.462-.925 1.69-1.699.21-.725.084-1.34-.374-1.861-.319-.366-.738-.596-1.169-.596-.146 0-.291.039-.425.113-.104.057-.192.104-.291.104-.126 0-.317-.15-.483-.33-.41-.442-.75-1.028-1.048-1.703-.226-.524-.016-1.297.525-1.716.301-.236.648-.354.997-.354 1.247 0 2.326.842 2.782 1.923.374.876.412 1.89.105 2.817z"/>
              </svg>
              Demander un accompagnement
            </a>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl mb-4">Visite virtuelle</h2>
            <p className="text-purple-100 mb-6">
              Découvrez le campus et les infrastructures sans vous déplacer.
            </p>
            <button className="px-8 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all font-medium">
              Découvrir le campus
            </button>
          </div>
        </div>

        {/* Établissements similaires - Carrousel */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Établissements similaires</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePrevSimilar()}
                disabled={currentSimilarPage === 0}
                className={`p-2 rounded-lg ${currentSimilarPage === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-gray-600">
                {similarEstablishments.length > 0 ? `${currentSimilarPage + 1}/${Math.ceil(similarEstablishments.length / itemsPerSlide)}` : '0/0'}
              </span>
              <button
                onClick={() => handleNextSimilar()}
                disabled={currentSimilarPage >= Math.ceil(similarEstablishments.length / itemsPerSlide) - 1}
                className={`p-2 rounded-lg ${currentSimilarPage >= Math.ceil(similarEstablishments.length / itemsPerSlide) - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {loadingSimilar ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Chargement des établissements similaires...</span>
            </div>
          ) : similarEstablishments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Building2 className="text-gray-400 mx-auto mb-4" size={48} />
              <p className="text-lg text-gray-500">Aucun établissement similaire trouvé</p>
              <p className="text-gray-400 mt-2">Découvrez d'autres établissements</p>
            </div>
          ) : (
            <>
              {/* Carrousel */}
              <div className="relative overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSimilarPage * 100}%)` }}
                >
                  {Array.from({ length: Math.ceil(similarEstablishments.length / itemsPerSlide) }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {similarEstablishments
                          .slice(slideIndex * itemsPerSlide, slideIndex * itemsPerSlide + itemsPerSlide)
                          .map((similar: any) => (
                            <div key={similar.id || similar._id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-200 hover:shadow-lg transition-all group">
                              <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(similar.type)}`}>
                                  {getTypeLabel(similar.type)}
                                </span>
                                {similar.isCAMESRecognized && (
                                  <CheckCircle2 className="text-green-500" size={16} />
                                )}
                              </div>
                              
                              <h3 className="text-lg font-medium text-gray-900 mb-3 group-hover:text-blue-600 transition-colors truncate">
                                {similar.name}
                              </h3>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <MapPin size={14} />
                                  <span className="truncate">{similar.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Users size={14} />
                                  <span>{similar.studentsCount ? `${similar.studentsCount.toLocaleString()}+` : 'N/A'} étudiants</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                  <span>{similar.rating?.toFixed(1) || 'N/A'}/5</span>
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => window.location.href = `/etablissements/${similar.id || similar._id}`}
                                className="w-full py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                              >
                                Voir détails
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Points indicateurs */}
              {similarEstablishments.length > itemsPerSlide && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: Math.ceil(similarEstablishments.length / itemsPerSlide) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSimilarPage(index)}
                      className={`w-2 h-2 rounded-full ${currentSimilarPage === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                      aria-label={`Aller au slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
          
          <div className="text-center mt-8 pt-8 border-t border-gray-100">
            <button
              onClick={() => window.location.href = `/etudier?type=${establishment.type}`}
              className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Voir tous les {getTypeLabel(establishment.type)}s
            </button>
          </div>
        </div>

        {/* Bouton retour global */}
        <div className="text-center">
          <button
            onClick={() => window.location.href = '/etudier'}
            className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl hover:shadow-lg transition-all"
          >
            Voir tous les établissements
          </button>
        </div>
      </div>

      {/* Footer de la page */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-lg mb-4">
              Vous avez des questions sur cet établissement ?
            </p>
            <p className="text-gray-400 mb-8">
              Notre équipe est disponible pour vous aider.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href={`https://wa.me/711457304?text=Bonjour,%20je%20suis%20sur%20la%20page%20de%20${encodeURIComponent(establishment.name)}%20et%20j'aimerais%20en%20savoir%20plus%20sur%20les%20admissions.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.032 0c-6.626 0-12 5.372-12 12 0 2.126.553 4.144 1.527 5.946l-1.458 5.383 5.524-1.458c1.757.951 3.756 1.465 5.894 1.465 6.627 0 12-5.372 12-12s-5.373-12-12-12zm5.633 17.018c-.329.925-1.61 1.689-2.635 1.761-.815.057-1.839-.205-3.475-.75-2.373-.795-4.294-2.857-4.855-5.116-.374-1.506.022-2.758.824-3.642.467-.514 1.12-.803 1.814-.803.246 0 .486.039.705.113.374.125.714.428.936.811.329.577.369.738.722 1.353.277.479.466.86.668 1.176.21.33.425.669.63.949.229.309.464.64.766.94.301.299.593.446.973.446.146 0 .29-.019.429-.057.773-.21 1.462-.925 1.69-1.699.21-.725.084-1.34-.374-1.861-.319-.366-.738-.596-1.169-.596-.146 0-.291.039-.425.113-.104.057-.192.104-.291.104-.126 0-.317-.15-.483-.33-.41-.442-.75-1.028-1.048-1.703-.226-.524-.016-1.297.525-1.716.301-.236.648-.354.997-.354 1.247 0 2.326.842 2.782 1.923.374.876.412 1.89.105 2.817z"/>
              </svg>
              Nous contacter sur WhatsApp
            </a>
            
            <a 
              href={`https://wa.me/711457304?text=Bonjour,%20je%20souhaite%20prendre%20un%20rendez-vous%20pour%20discuter%20de%20mon%20projet%20d'études%20à%20${encodeURIComponent(establishment.name)}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zm0-12H5V5h14v2zM7 11h5v5H7v-5z"/>
              </svg>
              Prendre rendez-vous
            </a>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}