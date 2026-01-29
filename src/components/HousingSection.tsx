import { Home, Building, Users, Wifi, Utensils, Droplet, Zap, MapPin, Search, SlidersHorizontal, Bed, Bath, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

export function HousingSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [housing, setHousing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔄 CHARGEMENT DES DONNÉES DEPUIS L'API
  useEffect(() => {
    const fetchHousing = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // AVANT : const response = await fetch('/api/housing');
        // APRÈS :
        const response = await fetch(`${API_BASE_URL}/api/housing`);
        
        if (!response.ok) {
          throw new Error(`Erreur API: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          // Transformez les données de l'API pour correspondre à votre frontend
          const formattedHousing = data.data.map((item: any) => ({
            id: item._id,
            name: item.title || item.name,
            type: item.type,
            location: item.location,
            neighborhood: item.neighborhood,
            price: item.price,
            bedrooms: item.bedrooms,
            bathrooms: item.bathrooms,
            amenities: item.amenities || [],
            available: item.isAvailable,
            contact: item.contact || {},
            features: item.features || {},
            images: item.images || []
          }));
          
          setHousing(formattedHousing);
        }
      } catch (err: any) {
        console.error('Erreur de chargement logements:', err);
        setError('Impossible de charger les logements. Vérifiez que le serveur backend est en marche.');
        
        // 🔄 FALLBACK: Utilisez les données statiques si l'API échoue
        setHousing(getFallbackData());
      } finally {
        setLoading(false);
      }
    };

    fetchHousing();
  }, []);

  // 📋 DONNÉES STATIQUES DE SECOURS
  const getFallbackData = () => {
    return [
      { id: 1, name: 'Cité Universitaire UCAD - Bloc A', type: 'university', location: 'Dakar', neighborhood: 'Fann', price: 20000, bedrooms: 1, bathrooms: 1, amenities: ['Sécurité 24/7', 'Cafétéria', 'WiFi'], available: true },
      { id: 2, name: 'Résidence UGB', type: 'university', location: 'Saint-Louis', neighborhood: 'Centre', price: 18000, bedrooms: 1, bathrooms: 1, amenities: ['Sécurité 24/7', 'Bibliothèque'], available: true },
      { id: 3, name: 'Cité Universitaire UCAD - Bloc B', type: 'university', location: 'Dakar', neighborhood: 'Fann', price: 22000, bedrooms: 1, bathrooms: 1, amenities: ['Sécurité 24/7', 'Cafétéria', 'WiFi', 'Salle de sport'], available: false },
      { id: 4, name: 'Colocation Sacré-Cœur 3', type: 'colocation', location: 'Dakar', neighborhood: 'Sacré-Cœur', price: 60000, bedrooms: 3, bathrooms: 2, amenities: ['WiFi', 'Cuisine équipée', 'Salon'], available: true },
      { id: 5, name: 'Appartement Mermoz', type: 'colocation', location: 'Dakar', neighborhood: 'Mermoz', price: 70000, bedrooms: 2, bathrooms: 1, amenities: ['WiFi', 'Cuisine équipée', 'Parking'], available: true },
      { id: 6, name: 'Colocation Liberté 6', type: 'colocation', location: 'Dakar', neighborhood: 'Liberté 6', price: 55000, bedrooms: 3, bathrooms: 2, amenities: ['WiFi', 'Cuisine équipée', 'Balcon'], available: true },
      { id: 7, name: 'Colocation Point E', type: 'colocation', location: 'Dakar', neighborhood: 'Point E', price: 65000, bedrooms: 2, bathrooms: 1, amenities: ['WiFi', 'Cuisine équipée', 'Climatisation'], available: false },
      { id: 8, name: 'Studio Liberté 6 Moderne', type: 'studio', location: 'Dakar', neighborhood: 'Liberté 6', price: 100000, bedrooms: 1, bathrooms: 1, amenities: ['WiFi', 'Kitchenette', 'Climatisation', 'Meublé'], available: true },
      { id: 9, name: 'Studio Ouakam Vue Mer', type: 'studio', location: 'Dakar', neighborhood: 'Ouakam', price: 120000, bedrooms: 1, bathrooms: 1, amenities: ['WiFi', 'Kitchenette', 'Climatisation', 'Meublé', 'Balcon'], available: true },
      { id: 10, name: 'Studio Mermoz Cosy', type: 'studio', location: 'Dakar', neighborhood: 'Mermoz', price: 95000, bedrooms: 1, bathrooms: 1, amenities: ['WiFi', 'Kitchenette', 'Meublé'], available: true },
      { id: 11, name: 'Studio Plateau Central', type: 'studio', location: 'Dakar', neighborhood: 'Plateau', price: 110000, bedrooms: 1, bathrooms: 1, amenities: ['WiFi', 'Kitchenette', 'Climatisation', 'Meublé', 'Sécurité'], available: false },
      { id: 12, name: 'Studio Almadies Premium', type: 'studio', location: 'Dakar', neighborhood: 'Almadies', price: 150000, bedrooms: 1, bathrooms: 1, amenities: ['WiFi', 'Kitchenette', 'Climatisation', 'Meublé', 'Piscine', 'Parking'], available: true },
    ];
  };

  const housingTypes = [
    {
      type: 'university',
      label: 'Résidences Universitaires',
      icon: Building,
      description: 'Logements gérés par les universités, économiques et proches du campus',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      type: 'colocation',
      label: 'Chambres en Colocation',
      icon: Users,
      description: 'Partagez un appartement avec d\'autres étudiants pour réduire les coûts',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      type: 'studio',
      label: 'Studios Privés',
      icon: Home,
      description: 'Logements indépendants pour plus d\'intimité et de confort',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const essentialAmenities = [
    { icon: Wifi, label: 'Internet', color: 'blue' },
    { icon: Zap, label: 'Électricité', color: 'yellow' },
    { icon: Droplet, label: 'Eau courante', color: 'cyan' },
    { icon: Utensils, label: 'Cuisine', color: 'orange' },
  ];

  // 📊 STATISTIQUES EN TEMPS RÉEL
  const totalHousing = housing.length;
  const availableHousing = housing.filter(h => h.available).length;
  const universityCount = housing.filter(h => h.type === 'university').length;
  const colocationCount = housing.filter(h => h.type === 'colocation').length;
  const studioCount = housing.filter(h => h.type === 'studio').length;

  // 🔍 FILTRE DES LOGEMENTS
  const filteredListings = housing.filter((listing) => {
    const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         listing.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || listing.type === selectedType;
    const matchesCity = selectedCity === 'all' || listing.location === selectedCity;
    
    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = listing.price < 50000;
    if (priceRange === 'medium') matchesPrice = listing.price >= 50000 && listing.price < 100000;
    if (priceRange === 'high') matchesPrice = listing.price >= 100000;
    
    return matchesSearch && matchesType && matchesCity && matchesPrice;
  });

  // 📈 CALCUL DES PRIX MIN/MAX
  const prices = housing.map(h => h.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">Se Loger au Sénégal</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Trouvez le logement étudiant qui correspond à vos besoins et votre budget
          </p>
          
          {/* Indicateur de source des données */}
          
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, quartier, ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Loader2 className="animate-spin text-purple-500" size={20} />
              </div>
            )}
          </div>

          {/* Toggle Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg mb-4 transition-colors text-gray-900"
            disabled={loading}
          >
            <SlidersHorizontal size={18} />
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </button>

          {/* Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 mb-2">Type de logement</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                  disabled={loading}
                >
                  <option value="all">Tous les types</option>
                  <option value="university">Résidences Universitaires ({universityCount})</option>
                  <option value="colocation">Colocations ({colocationCount})</option>
                  <option value="studio">Studios ({studioCount})</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Ville</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                  disabled={loading}
                >
                  <option value="all">Toutes les villes</option>
                  <option value="Dakar">Dakar</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Thiès">Thiès</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Budget mensuel</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none text-gray-900 bg-white"
                  disabled={loading}
                >
                  <option value="all">Tous les budgets</option>
                  <option value="low">Moins de 50,000 FCFA</option>
                  <option value="medium">50,000 - 100,000 FCFA</option>
                  <option value="high">Plus de 100,000 FCFA</option>
                </select>
                {!loading && maxPrice > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Fourchette: {minPrice.toLocaleString()} - {maxPrice.toLocaleString()} FCFA
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-gray-600">
            <span className="text-blue-600 font-medium">{filteredListings.length}</span> logement(s) disponible(s)
            {totalHousing > 0 && (
              <span className="text-sm text-gray-500 ml-2">
                (sur {totalHousing} au total, {availableHousing} disponibles)
              </span>
            )}
          </div>
        </div>

        {/* Hero Image */}
        <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1579632151052-92f741fb9b79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwYXBhcnRtZW50JTIwYmVkcm9vbXxlbnwxfHx8fDE3NjYyMjQzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Logement étudiant"
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Statistics Bar */}
        {!loading && totalHousing > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl text-gray-900 mb-4 text-center">Statistiques des logements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">{totalHousing}</div>
                <div className="text-sm text-gray-600">Total logements</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">{availableHousing}</div>
                <div className="text-sm text-gray-600">Disponibles</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">
                  {totalHousing > 0 ? Math.round((availableHousing / totalHousing) * 100) : 0}%
                </div>
                <div className="text-sm text-gray-600">Taux de disponibilité</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-xl">
                <div className="text-2xl font-bold text-amber-600">
                  {totalHousing > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / totalHousing).toLocaleString() : 0}
                </div>
                <div className="text-sm text-gray-600">Prix moyen (FCFA)</div>
              </div>
            </div>
          </div>
        )}

        {/* Essential Amenities */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-2xl text-gray-900 mb-6 text-center">Équipements Essentiels</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {essentialAmenities.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <div key={amenity.label} className="text-center">
                  <div className={`bg-${amenity.color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3`}>
                    <Icon className={`text-${amenity.color}-600`} size={28} />
                  </div>
                  <p className="text-gray-800">{amenity.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl text-gray-900">Annonces disponibles</h2>
           
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <Loader2 className="animate-spin mx-auto text-purple-500 mb-4" size={48} />
              <p className="text-xl text-gray-600">Chargement des logements...</p>
              <p className="text-gray-400 mt-2">Connexion à la base de données</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 bg-amber-50 rounded-2xl border-2 border-amber-200">
              <div className="text-amber-600 mb-4">⚠️</div>
              <p className="text-xl text-gray-900 mb-2">Mode hors ligne activé</p>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-gray-500 text-sm">Vous visualisez des données statiques de démonstration.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Réessayer la connexion
              </button>
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <p className="text-xl text-gray-500">Aucun logement trouvé</p>
              <p className="text-gray-400 mt-2">Essayez de modifier vos critères de recherche</p>
              {totalHousing === 0 && (
                <div className="mt-4">
                  <p className="text-gray-500">La base de données est vide.</p>
                
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => {
                const typeInfo = housingTypes.find(t => t.type === listing.type);
                const Icon = typeInfo?.icon || Home;
                
                return (
                  <div
                    key={listing.id}
                    className={`bg-white border-2 rounded-xl overflow-hidden hover:shadow-xl transition-all group ${
                      listing.available ? 'border-gray-100 hover:border-blue-200' : 'border-gray-200 opacity-75'
                    }`}
                  >
                    <div className={`bg-gradient-to-r ${typeInfo?.color} p-4 text-white relative`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={24} />
                        {!listing.available && (
                          <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                            Non disponible
                          </span>
                        )}
                        {listing.available && (
                          <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                            Disponible
                          </span>
                        )}
                      </div>
                      <div className="text-2xl mb-1">{listing.price.toLocaleString()} FCFA/mois</div>
                      <div className="text-sm text-white/80">{typeInfo?.label}</div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                        {listing.name}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={16} className="text-blue-500" />
                          <span>{listing.neighborhood}, {listing.location}</span>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                          <div className="flex items-center gap-1">
                            <Bed size={16} className="text-indigo-500" />
                            <span>{listing.bedrooms} ch.</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Bath size={16} className="text-purple-500" />
                            <span>{listing.bathrooms} sdb</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {listing.amenities.slice(0, 3).map((amenity: string) => (
                            <span key={amenity} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                          {listing.amenities.length > 3 && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              +{listing.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <button 
                        className={`w-full px-4 py-2 rounded-lg transition-all ${
                          listing.available
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!listing.available}
                      >
                        {listing.available ? 'Voir les détails' : 'Indisponible'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl mb-4">Besoin d'aide pour trouver votre logement ?</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Notre équipe peut vous aider à trouver le logement parfait selon vos besoins et votre budget
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all shadow-lg">
              Commencer la recherche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}