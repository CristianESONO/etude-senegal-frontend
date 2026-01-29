// src/components/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { Building2, Home, Users, Plus, Edit, Trash2, Eye, Upload, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { EstablishmentForm } from './forms/EstablishmentForm';
import { HousingForm } from './forms/HousingForm';
import { ExcelUpload } from './forms/ExcelUpload';
import { API_BASE_URL } from '../config/api';


export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'establishments' | 'housing' | 'users'>('establishments');
  const [establishments, setEstablishments] = useState([]);
  const [housing, setHousing] = useState([]);
  
  // États pour les formulaires
  const [showEstablishmentForm, setShowEstablishmentForm] = useState(false);
  const [showHousingForm, setShowHousingForm] = useState(false);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  
  // États pour la pagination et la recherche
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [limit] = useState(10); // Nombre d'éléments par page
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === 'establishments') {
      fetchEstablishments();
    } else if (activeTab === 'housing') {
      fetchHousing();
    }
    // Réinitialiser la page à 1 quand on change d'onglet
    setCurrentPage(1);
  }, [activeTab]);

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchEstablishments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString()
      });
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/establishments?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setEstablishments(data.data);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHousing = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString()
      });
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await fetch(`${API_BASE_URL}/api/housing?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setHousing(data.data);
        setTotalPages(data.totalPages || 1);
        setTotalItems(data.total || 0);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Rafraîchir les données quand la page change
  useEffect(() => {
    if (activeTab === 'establishments') {
      fetchEstablishments();
    } else if (activeTab === 'housing') {
      fetchHousing();
    }
  }, [currentPage]);

  const handleDelete = async (id: string, type: 'establishment' | 'housing') => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
      return;
    }

    try {
      const endpoint = type === 'establishment' ? '/api/establishments' : '/api/housing';
      const response = await fetch(`${API_BASE_URL}${endpoint}/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        if (type === 'establishment') {
          fetchEstablishments();
        } else {
          fetchHousing();
        }
        alert('Supprimé avec succès !');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion au serveur');
    }
  };

  const handleView = (item: any) => {
    const url = activeTab === 'establishments' 
      ? `/etablissements/${item._id}` 
      : `/logements/${item._id}`;
    window.open(url, '_blank');
  };

  const handleAddClick = () => {
    setSelectedItem(null);
    setFormMode('create');
    if (activeTab === 'establishments') {
      setShowEstablishmentForm(true);
    } else if (activeTab === 'housing') {
      setShowHousingForm(true);
    }
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    setFormMode('edit');
    if (activeTab === 'establishments') {
      setShowEstablishmentForm(true);
    } else if (activeTab === 'housing') {
      setShowHousingForm(true);
    }
  };

  const handleExcelUploadClick = () => {
    setShowExcelUpload(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
    window.location.href = '/';
  };

  // Fonctions de pagination
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
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3);
        if (totalPages > 4) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        if (totalPages > 4) pageNumbers.push('...');
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...');
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        if (currentPage + 2 < totalPages) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  const currentData = activeTab === 'establishments' ? establishments : 
                     activeTab === 'housing' ? housing : [];

  const getStatusBadge = (item: any) => {
    if (activeTab === 'establishments') {
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.isCAMESRecognized ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {item.isCAMESRecognized ? 'CAMES ✅' : 'Non CAMES'}
        </span>
      );
    } else if (activeTab === 'housing') {
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {item.isAvailable ? 'Disponible' : 'Indisponible'}
        </span>
      );
    }
    return null;
  };

  const getTypeBadge = (type: string) => {
    const typeStyles: Record<string, string> = {
      'university': 'bg-blue-100 text-blue-800',
      'school': 'bg-purple-100 text-purple-800',
      'institute': 'bg-green-100 text-green-800',
      'studio': 'bg-yellow-100 text-yellow-800',
      'colocation': 'bg-pink-100 text-pink-800',
      'apartment': 'bg-indigo-100 text-indigo-800',
      'university-housing': 'bg-teal-100 text-teal-800'
    };

    const typeLabels: Record<string, string> = {
      'university': 'Université',
      'school': 'École',
      'institute': 'Institut',
      'studio': 'Studio',
      'colocation': 'Colocation',
      'apartment': 'Appartement',
      'university-housing': 'Résidence'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeStyles[type] || 'bg-gray-100 text-gray-800'}`}>
        {typeLabels[type] || type}
      </span>
    );
  };

  // Calcul de l'affichage des résultats
  const startIndex = (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalItems);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Admin */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin EtudeSénégal</h1>
                <p className="text-sm text-gray-600">Tableau de bord de gestion</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {[
            { id: 'establishments', label: 'Établissements', icon: Building2 },
            { id: 'housing', label: 'Logements', icon: Home },
            { id: 'users', label: 'Utilisateurs', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {/* Header avec recherche et boutons */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'establishments' ? 'Établissements' : 
                 activeTab === 'housing' ? 'Logements' : 'Utilisateurs'}
              </h2>
              <p className="text-gray-600 mt-1">
                {totalItems} élément{totalItems > 1 ? 's' : ''} au total • 
                Page {currentPage} sur {totalPages}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      if (activeTab === 'establishments') {
                        fetchEstablishments();
                      } else if (activeTab === 'housing') {
                        fetchHousing();
                      }
                    }
                  }}
                  className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none w-full sm:w-64"
                  disabled={loading}
                />
              </div>
              
              {activeTab !== 'users' && (
                <div className="flex gap-2">
                  <button
                    onClick={handleExcelUploadClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
                    disabled={loading}
                  >
                    <Upload size={20} />
                    Importer Excel
                  </button>
                  <button
                    onClick={handleAddClick}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all whitespace-nowrap"
                    disabled={loading}
                  >
                    <Plus size={20} />
                    Ajouter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Liste */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Chargement des données...</p>
              </div>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-100">
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Nom</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Localisation</th>
                      {activeTab === 'establishments' && (
                        <th className="text-left py-3 px-4 text-gray-700 font-medium">Étudiants</th>
                      )}
                      {activeTab === 'housing' && (
                        <th className="text-left py-3 px-4 text-gray-700 font-medium">Prix</th>
                      )}
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Statut</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item: any) => (
                      <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium">
                          {activeTab === 'establishments' ? item.name : item.title}
                        </td>
                        <td className="py-3 px-4">
                          {getTypeBadge(item.type)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-medium">{item.location}</span>
                            {activeTab === 'housing' && item.neighborhood && (
                              <span className="text-sm text-gray-500">{item.neighborhood}</span>
                            )}
                          </div>
                        </td>
                        
                        {activeTab === 'establishments' && (
                          <td className="py-3 px-4">
                            <span className="font-medium">{item.studentsCount?.toLocaleString() || 0}</span>
                          </td>
                        )}
                        
                        {activeTab === 'housing' && (
                          <td className="py-3 px-4">
                            <span className="font-medium">{item.price?.toLocaleString() || 0} FCFA</span>
                          </td>
                        )}
                        
                        <td className="py-3 px-4">
                          {getStatusBadge(item)}
                        </td>
                        
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleView(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Voir"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditClick(item)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Modifier"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item._id, activeTab.slice(0, -1) as 'establishment' | 'housing')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {currentData.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center">
                            <Building2 className="text-gray-300 mb-2" size={48} />
                            <p className="text-lg">Aucun élément trouvé</p>
                            {searchQuery ? (
                              <p className="text-sm">Aucun résultat pour "{searchQuery}"</p>
                            ) : (
                              <p className="text-sm">Commencez par ajouter un nouvel élément</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Contrôles de pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
                    <div className="text-gray-600">
                      Affichage de {startIndex} à {endIndex} sur {totalItems} éléments
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {/* Bouton précédent */}
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1 || loading}
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
                              disabled={loading}
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
                        disabled={currentPage === totalPages || loading}
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
                      {limit} éléments par page
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Formulaire des établissements */}
      {showEstablishmentForm && (
        <EstablishmentForm
          onClose={() => {
            setShowEstablishmentForm(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            fetchEstablishments();
            setShowEstablishmentForm(false);
            setSelectedItem(null);
          }}
          initialData={selectedItem}
          mode={formMode}
        />
      )}

      {/* Formulaire des logements */}
      {showHousingForm && (
        <HousingForm
          onClose={() => {
            setShowHousingForm(false);
            setSelectedItem(null);
          }}
          onSuccess={() => {
            fetchHousing();
            setShowHousingForm(false);
            setSelectedItem(null);
          }}
          initialData={selectedItem}
          mode={formMode}
        />
      )}

      {/* Formulaire Excel Upload */}
      {showExcelUpload && (
        <ExcelUpload
          onClose={() => setShowExcelUpload(false)}
          onSuccess={() => {
            if (activeTab === 'establishments') {
              fetchEstablishments();
            } else if (activeTab === 'housing') {
              fetchHousing();
            }
            setShowExcelUpload(false);
          }}
          type={activeTab as 'establishments' | 'housing'}
        />
      )}
    </div>
  );
}