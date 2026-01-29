// src/components/forms/EstablishmentForm.tsx
import { useState, useEffect } from 'react';
import { X, Building2, Plus, Trash2, Save } from 'lucide-react';

interface EstablishmentFormProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  mode: 'create' | 'edit';
}

export function EstablishmentForm({ onClose, onSuccess, initialData, mode }: EstablishmentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [programInput, setProgramInput] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'university',
    location: 'Dakar',
    description: '',
    studentsCount: 0,
    rating: 0,
    programs: [] as string[],
    images: [] as string[],
    isCAMESRecognized: false,
    contact: {
      email: '',
      phone: '',
      website: ''
    },
    coordinates: {
      lat: 0,
      lng: 0
    }
  });

  // Initialiser avec les données existantes en mode édition
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        type: initialData.type || 'university',
        location: initialData.location || 'Dakar',
        description: initialData.description || '',
        studentsCount: initialData.studentsCount || 0,
        rating: initialData.rating || 0,
        programs: initialData.programs || [],
        images: initialData.images || [],
        isCAMESRecognized: initialData.isCAMESRecognized || false,
        contact: initialData.contact || { email: '', phone: '', website: '' },
        coordinates: initialData.coordinates || { lat: 0, lng: 0 }
      });
    }
  }, [mode, initialData]);

  // Dans la fonction handleSubmit de EstablishmentForm.tsx, modifiez :

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    // Utilisez _id au lieu de id, car c'est le nom du champ dans MongoDB
    const establishmentId = initialData?._id || initialData?.id;
    
    const url = mode === 'create' 
      ? '/api/establishments' 
      : `/api/establishments/${establishmentId}`;  // Ici utiliser establishmentId
    
    const method = mode === 'create' ? 'POST' : 'PUT';

    console.log('Mode:', mode);
    console.log('ID envoyé:', establishmentId);
    console.log('URL:', url);

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
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

  const addProgram = () => {
    if (programInput.trim() && !formData.programs.includes(programInput.trim())) {
      setFormData({
        ...formData,
        programs: [...formData.programs, programInput.trim()]
      });
      setProgramInput('');
    }
  };

  const removeProgram = (index: number) => {
    setFormData({
      ...formData,
      programs: formData.programs.filter((_, i) => i !== index)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addProgram();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {mode === 'create' ? 'Ajouter un établissement' : 'Modifier l\'établissement'}
                </h2>
                <p className="text-sm text-gray-600">
                  {mode === 'create' ? 'Remplissez les informations de l\'établissement' : 'Modifiez les informations de l\'établissement'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'établissement *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="Université Cheikh Anta Diop"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'établissement *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  disabled={loading}
                >
                  <option value="university">Université</option>
                  <option value="school">École Supérieure</option>
                  <option value="institute">Institut Spécialisé</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Dakar, Sénégal"
                required
                disabled={loading}
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
                placeholder="Description complète de l'établissement..."
                required
                disabled={loading}
                rows={4}
              />
            </div>
          </div>

          {/* Statistiques */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Statistiques</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre d'étudiants
                </label>
                <input
                  type="number"
                  value={formData.studentsCount}
                  onChange={(e) => setFormData({...formData, studentsCount: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                  min="0"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Note (0-5)
                </label>
                <input
                  type="number"
                  value={formData.rating}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    setFormData({...formData, rating: Math.min(5, Math.max(0, value))});
                  }}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="0.0"
                  min="0"
                  max="5"
                  step="0.1"
                  disabled={loading}
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isCAMESRecognized}
                    onChange={(e) => setFormData({...formData, isCAMESRecognized: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Reconnu CAMES
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Programmes */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Programmes d'études</h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={programInput}
                onChange={(e) => setProgramInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="Ajouter un programme (ex: Médecine)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={addProgram}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                disabled={loading}
              >
                <Plus size={20} />
                Ajouter
              </button>
            </div>

            {formData.programs.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.programs.map((program, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg"
                  >
                    <span>{program}</span>
                    <button
                      type="button"
                      onClick={() => removeProgram(index)}
                      className="text-blue-500 hover:text-blue-700"
                      disabled={loading}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
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
                  placeholder="contact@etablissement.sn"
                  required
                  disabled={loading}
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
                  placeholder="+221 33 XXX XX XX"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site web
              </label>
              <input
                type="url"
                value={formData.contact.website}
                onChange={(e) => setFormData({
                  ...formData,
                  contact: {...formData.contact, website: e.target.value}
                })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="https://www.etablissement.sn"
                disabled={loading}
              />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors flex-1"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save size={20} />
                  {mode === 'create' ? 'Créer l\'établissement' : 'Mettre à jour'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}