// src/components/forms/HousingForm.tsx - VERSION AVEC UPLOAD RÉEL (CORRIGÉE)
import { useState, useEffect, useRef } from 'react';
import { X, Home, Plus, Trash2, Save, Check, Image as ImageIcon, Upload, Loader } from 'lucide-react';

interface HousingFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  mode: 'create' | 'edit';
}

interface UploadedImage {
  fileId: string;
  url: string;
  originalName: string;
}

// Constante pour l'URL du backend - À MODIFIER SELON VOTRE ENVIRONNEMENT
const API_URL = 'http://localhost:5000'; // Changez ceci si votre backend est sur un autre port/domaine

export function HousingForm({ onClose, onSuccess, initialData, mode }: HousingFormProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [amenityInput, setAmenityInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'studio' as 'studio' | 'colocation' | 'university',
    location: 'Dakar',
    neighborhood: '',
    price: 0,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [] as string[],
    images: [] as string[], // URLs des images
    imageIds: [] as string[], // IDs GridFS des images
    isAvailable: true,
    contact: {
      name: '',
      phone: '',
      email: ''
    },
    features: {
      hasFurniture: false,
      hasInternet: false,
      hasKitchen: false
    }
  });

  // Fonction helper pour obtenir l'URL complète d'une image
  const getImageUrl = (imageUrl: string): string => {
    if (imageUrl.startsWith('/api/upload/')) {
      // Si c'est une URL d'API relative, ajouter l'URL du backend
      return `${API_URL}${imageUrl}`;
    }
    // Sinon, retourner l'URL telle quelle (data URL ou URL externe)
    return imageUrl;
  };

  // Initialiser avec les données existantes en mode édition
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        type: initialData.type || 'studio',
        location: initialData.location || 'Dakar',
        neighborhood: initialData.neighborhood || '',
        price: initialData.price || 0,
        bedrooms: initialData.bedrooms || 1,
        bathrooms: initialData.bathrooms || 1,
        amenities: initialData.amenities || [],
        images: initialData.images || [],
        imageIds: initialData.imageIds || [],
        isAvailable: initialData.isAvailable !== false,
        contact: initialData.contact || { name: '', phone: '', email: '' },
        features: initialData.features || {
          hasFurniture: false,
          hasInternet: false,
          hasKitchen: false
        }
      });
    }
  }, [mode, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = mode === 'create' 
        ? `${API_URL}/api/housing` 
        : `${API_URL}/api/housing/${initialData.id || initialData._id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';

      // Préparer les données pour l'envoi
      const dataToSend = {
        ...formData,
        // S'assurer que les nombres sont bien des nombres
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms)
      };

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken') || ''}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Erreur lors de l\'enregistrement');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()]
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addAmenity();
    }
  };

  const toggleFeature = (feature: keyof typeof formData.features) => {
    setFormData({
      ...formData,
      features: {
        ...formData.features,
        [feature]: !formData.features[feature]
      }
    });
  };

  // Fonction pour uploader une image vers le backend
  const uploadImage = async (file: File): Promise<UploadedImage> => {
    const formDataObj = new FormData();
    formDataObj.append('image', file);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataObj
      });

      const data = await response.json();
      
      if (data.success) {
        return {
          fileId: data.fileId,
          url: data.url,
          originalName: data.originalName
        };
      } else {
        throw new Error(data.message || 'Erreur lors de l\'upload');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      throw error;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');

    try {
      // Uploader tous les fichiers
      const uploadPromises = Array.from(files).map(file => uploadImage(file));
      const uploadedImages = await Promise.all(uploadPromises);

      // Mettre à jour l'état avec les nouvelles images
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages.map(img => img.url)],
        imageIds: [...prev.imageIds, ...uploadedImages.map(img => img.fileId)]
      }));

    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload des images');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = async (index: number) => {
    try {
      const imageId = formData.imageIds[index];
      const token = localStorage.getItem('adminToken');
      
      // Si nous avons un ID d'image (stockée dans GridFS), la supprimer du backend
      if (imageId) {
        await fetch(`${API_URL}/api/upload/${imageId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
      
      // Mettre à jour l'état local
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        imageIds: prev.imageIds.filter((_, i) => i !== index)
      }));
      
    } catch (err) {
      console.error('Erreur suppression image:', err);
      // En cas d'erreur, supprimer quand même de l'état local
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
        imageIds: prev.imageIds.filter((_, i) => i !== index)
      }));
    }
  };

  // Fonction pour sélectionner les fichiers
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg">
                <Home className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {mode === 'create' ? 'Ajouter un logement' : 'Modifier le logement'}
                </h2>
                <p className="text-sm text-gray-600">
                  {mode === 'create' ? 'Remplissez les informations du logement' : 'Modifiez les informations du logement'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              type="button"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Informations de base */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informations de base</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'annonce *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Studio moderne Liberté 6"
                required
                disabled={loading || uploading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none min-h-[100px]"
                placeholder="Description complète du logement..."
                required
                disabled={loading || uploading}
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de logement *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  disabled={loading || uploading}
                  required
                >
                  <option value="studio">Studio</option>
                  <option value="colocation">Colocation</option>
                  <option value="university">Résidence universitaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix mensuel (FCFA) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="50000"
                  min="0"
                  step="1000"
                  required
                  disabled={loading || uploading}
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({...formData, isAvailable: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading || uploading}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Disponible
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Localisation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Localisation</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville *
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  disabled={loading || uploading}
                  required
                >
                  <option value="Dakar">Dakar</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                  <option value="Kaolack">Kaolack</option>
                  <option value="Mbour">Mbour</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quartier *
                </label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({...formData, neighborhood: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Liberté 6, Sacré-Cœur, Plateau..."
                  required
                  disabled={loading || uploading}
                />
              </div>
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Caractéristiques</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de chambres *
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  disabled={loading || uploading}
                  required
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} chambre{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de salles de bain *
                </label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({...formData, bathrooms: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  disabled={loading || uploading}
                  required
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num} salle{num > 1 ? 's' : ''} de bain</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Images du logement</h3>
              {formData.images.length > 0 && (
                <span className="text-sm text-gray-500">
                  {formData.images.length} image{formData.images.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            
            <div className="space-y-3">
              {/* Upload d'images */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  multiple
                  disabled={uploading || loading}
                />
                
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="flex flex-col items-center gap-2 w-full cursor-pointer disabled:opacity-50"
                  disabled={uploading || loading}
                >
                  {uploading ? (
                    <>
                      <Loader className="animate-spin text-blue-600" size={24} />
                      <p className="text-sm text-blue-600">
                        Upload en cours...
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-400" size={24} />
                      <div>
                        <p className="text-sm text-gray-600">
                          Cliquez pour sélectionner des images
                        </p>
                        <p className="text-xs text-gray-500">
                          Formats supportés: JPG, PNG, WEBP (max 10MB par image)
                        </p>
                      </div>
                    </>
                  )}
                </button>
              </div>

              {/* Liste des images */}
              {formData.images.length > 0 && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                          <img 
                            src={getImageUrl(image)}  
                            alt={`Image ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Non+Disponible';
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          disabled={loading || uploading}
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="text-xs text-gray-500 truncate mt-1">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500 text-center">
                    {formData.images.length} image{formData.images.length > 1 ? 's' : ''} téléchargée{formData.images.length > 1 ? 's' : ''}
                  </div>
                </>
              )}

              {formData.images.length === 0 && !uploading && (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <ImageIcon className="text-gray-400 mx-auto mb-2" size={32} />
                  <p className="text-gray-500">Aucune image ajoutée</p>
                  <p className="text-sm text-gray-400">Ajoutez des images pour attirer plus d'étudiants</p>
                </div>
              )}
            </div>
          </div>

          {/* Équipements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Équipements</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Ajouter un équipement (ex: WiFi, Climatisation, Balcon)"
                disabled={loading || uploading}
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                disabled={loading || uploading}
              >
                <Plus size={20} />
                Ajouter
              </button>
            </div>

            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg"
                  >
                    <span className="text-sm">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="text-purple-500 hover:text-purple-700 disabled:opacity-50"
                      disabled={loading || uploading}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Features (cases à cocher) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Équipements inclus</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(formData.features).map(([key, value]) => (
                <label
                  key={key}
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${loading || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => toggleFeature(key as keyof typeof formData.features)}
                    className="hidden"
                    disabled={loading || uploading}
                  />
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    value
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}>
                    {value && <Check size={12} className="text-white" />}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {key === 'hasFurniture' && 'Meublé'}
                    {key === 'hasInternet' && 'Internet'}
                    {key === 'hasKitchen' && 'Cuisine équipée'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.contact.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: {...formData.contact, name: e.target.value}
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Nom du propriétaire"
                  required
                  disabled={loading || uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: {...formData.contact, phone: e.target.value}
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="+221 77 123 45 67"
                  required
                  disabled={loading || uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData({
                    ...formData,
                    contact: {...formData.contact, email: e.target.value}
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="contact@email.com"
                  required
                  disabled={loading || uploading}
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex-1 disabled:opacity-50"
              disabled={loading || uploading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {(loading || uploading) ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  {uploading ? 'Upload en cours...' : 'Enregistrement...'}
                </>
              ) : (
                <>
                  <Save size={20} />
                  {mode === 'create' ? 'Créer le logement' : 'Mettre à jour'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}