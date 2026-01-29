// src/components/forms/ExcelUpload.tsx
import { useState, useRef } from 'react';
import { X, Upload, FileSpreadsheet, Check, AlertCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExcelUploadProps {
  onClose: () => void;
  onSuccess: () => void;
  type: 'establishments' | 'housing';
}

export function ExcelUpload({ onClose, onSuccess, type }: ExcelUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fileName, setFileName] = useState('');
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modèle Excel pour établissements
  const establishmentTemplate = [
    {
      'Nom*': 'Université Cheikh Anta Diop',
      'Type*': 'university',
      'Localisation*': 'Dakar',
      'Description': 'Description de l\'établissement',
      'Nombre Étudiants': 80000,
      'Note (0-5)': 4.5,
      'CAMES (oui/non)': 'oui',
      'Programmes (séparés par ,)': 'Médecine,Droit,Sciences Économiques',
      'Email*': 'contact@ucad.sn',
      'Téléphone*': '+221338250500',
      'Site Web': 'https://www.ucad.sn'
    }
  ];

  // Modèle Excel pour logements
  const housingTemplate = [
    {
      'Titre*': 'Studio moderne Liberté 6',
      'Type*': 'studio',
      'Ville*': 'Dakar',
      'Quartier*': 'Liberté 6',
      'Description': 'Studio meublé avec internet',
      'Prix*': 75000,
      'Chambres': 1,
      'Salles de bain': 1,
      'Disponible (oui/non)': 'oui',
      'Équipements (séparés par ,)': 'WiFi,Climatisation',
      'Meublé (oui/non)': 'oui',
      'Internet (oui/non)': 'oui',
      'Cuisine (oui/non)': 'oui',
      'Parking (oui/non)': 'non',
      'Sécurité (oui/non)': 'oui',
      'Nom Contact*': 'M. Diallo',
      'Téléphone Contact*': '+221771234567',
      'Email Contact*': 'contact@email.com'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setError('');
    setPreviewData([]);
    setValidationErrors([]);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          setError('Le fichier Excel est vide');
          return;
        }

        // Valider les données
        const errors = validateData(jsonData, type);
        if (errors.length > 0) {
          setValidationErrors(errors);
          setPreviewData(jsonData.slice(0, 5)); // Afficher les 5 premières lignes pour débogage
          return;
        }

        setPreviewData(jsonData.slice(0, 5)); // Afficher un aperçu
      } catch (err) {
        setError('Erreur lors de la lecture du fichier Excel');
        console.error(err);
      }
    };
    reader.readAsBinaryString(file);
  };

  const validateData = (data: any[], uploadType: string): string[] => {
    const errors: string[] = [];
    
    if (uploadType === 'establishments') {
      data.forEach((row, index) => {
        const rowNum = index + 2; // +2 car Excel commence à 1 et header à 1
        
        // Vérifier les champs requis
        if (!row['Nom*']) errors.push(`Ligne ${rowNum}: Nom manquant`);
        if (!row['Type*']) errors.push(`Ligne ${rowNum}: Type manquant`);
        if (!row['Localisation*']) errors.push(`Ligne ${rowNum}: Localisation manquant`);
        if (!row['Email*']) errors.push(`Ligne ${rowNum}: Email manquant`);
        if (!row['Téléphone*']) errors.push(`Ligne ${rowNum}: Téléphone manquant`);
        
        // Valider le type
        if (row['Type*'] && !['university', 'school', 'institute'].includes(row['Type*'].toLowerCase())) {
          errors.push(`Ligne ${rowNum}: Type invalide (doit être: university, school, institute)`);
        }
        
        // Valider le booléen CAMES
        if (row['CAMES (oui/non)'] && !['oui', 'non', 'yes', 'no', 'true', 'false', '1', '0'].includes(row['CAMES (oui/non)'].toString().toLowerCase())) {
          errors.push(`Ligne ${rowNum}: CAMES doit être "oui" ou "non"`);
        }
      });
    } else if (uploadType === 'housing') {
      data.forEach((row, index) => {
        const rowNum = index + 2;
        
        if (!row['Titre*']) errors.push(`Ligne ${rowNum}: Titre manquant`);
        if (!row['Type*']) errors.push(`Ligne ${rowNum}: Type manquant`);
        if (!row['Ville*']) errors.push(`Ligne ${rowNum}: Ville manquant`);
        if (!row['Quartier*']) errors.push(`Ligne ${rowNum}: Quartier manquant`);
        if (!row['Prix*']) errors.push(`Ligne ${rowNum}: Prix manquant`);
        if (!row['Nom Contact*']) errors.push(`Ligne ${rowNum}: Nom Contact manquant`);
        if (!row['Téléphone Contact*']) errors.push(`Ligne ${rowNum}: Téléphone Contact manquant`);
        if (!row['Email Contact*']) errors.push(`Ligne ${rowNum}: Email Contact manquant`);
        
        if (row['Prix*'] && (isNaN(row['Prix*']) || row['Prix*'] < 0)) {
          errors.push(`Ligne ${rowNum}: Prix invalide`);
        }
      });
    }
    
    return errors;
  };

  const transformData = (data: any[], uploadType: string): any[] => {
    if (uploadType === 'establishments') {
      return data.map(row => ({
        name: row['Nom*'],
        type: row['Type*'].toLowerCase(),
        location: row['Localisation*'],
        description: row['Description'] || '',
        studentsCount: parseInt(row['Nombre Étudiants']) || 0,
        rating: parseFloat(row['Note (0-5)']) || 0,
        isCAMESRecognized: ['oui', 'yes', 'true', '1'].includes(row['CAMES (oui/non)']?.toString().toLowerCase()),
        programs: row['Programmes (séparés par ,)'] ? 
                 row['Programmes (séparés par ,)'].split(',').map((p: string) => p.trim()) : [],
        images: [],
        contact: {
          email: row['Email*'],
          phone: row['Téléphone*'],
          website: row['Site Web'] || ''
        }
      }));
    } else {
      return data.map(row => ({
        title: row['Titre*'],
        type: row['Type*'].toLowerCase(),
        location: row['Ville*'],
        neighborhood: row['Quartier*'],
        description: row['Description'] || '',
        price: parseInt(row['Prix*']) || 0,
        bedrooms: parseInt(row['Chambres']) || 1,
        bathrooms: parseInt(row['Salles de bain']) || 1,
        isAvailable: ['oui', 'yes', 'true', '1'].includes(row['Disponible (oui/non)']?.toString().toLowerCase()),
        amenities: row['Équipements (séparés par ,)'] ? 
                  row['Équipements (séparés par ,)'].split(',').map((a: string) => a.trim()) : [],
        images: [],
        contact: {
          name: row['Nom Contact*'],
          phone: row['Téléphone Contact*'],
          email: row['Email Contact*']
        },
        features: {
          hasFurniture: ['oui', 'yes', 'true', '1'].includes(row['Meublé (oui/non)']?.toString().toLowerCase()),
          hasInternet: ['oui', 'yes', 'true', '1'].includes(row['Internet (oui/non)']?.toString().toLowerCase()),
          hasKitchen: ['oui', 'yes', 'true', '1'].includes(row['Cuisine (oui/non)']?.toString().toLowerCase()),
          hasParking: ['oui', 'yes', 'true', '1'].includes(row['Parking (oui/non)']?.toString().toLowerCase()),
          hasSecurity: ['oui', 'yes', 'true', '1'].includes(row['Sécurité (oui/non)']?.toString().toLowerCase())
        }
      }));
    }
  };

  const handleSubmit = async () => {
  if (!fileName) {
    setError('Veuillez d\'abord sélectionner un fichier');
    return;
  }

  if (validationErrors.length > 0) {
    setError('Veuillez corriger les erreurs de validation avant de continuer');
    return;
  }

  setLoading(true);
  setError('');

  try {
    const file = fileInputRef.current?.files?.[0];
    if (!file) throw new Error('Aucun fichier sélectionné');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const transformedData = transformData(jsonData, type);
        
        // Envoyer toutes les données en une seule fois (batch unique)
        const response = await fetch(`/api/${type}/batch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: transformedData })
        });
        
        const result = await response.json();
        
        if (result.success) {
          const importedCount = result.summary?.imported || result.importedCount || 0;
          setSuccess(`${importedCount} ${type === 'establishments' ? 'établissements' : 'logements'} importés avec succès`);
          
          if (result.summary?.errorDetails?.length > 0) {
            setError(`${result.summary.errorDetails.length} erreurs: ${result.summary.errorDetails.join(', ')}`);
          }
          
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        } else {
          setError(result.message || 'Erreur lors de l\'import');
        }
      } catch (err) {
        setError('Erreur lors du traitement des données');
        console.error(err);
      }
    };
    
    reader.readAsBinaryString(file);
  } catch (err) {
    setError('Erreur lors de l\'importation');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  const downloadTemplate = () => {
  try {
    const template = type === 'establishments' ? establishmentTemplate : housingTemplate;
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
    
    // Ajuster les largeurs de colonnes
    const wscols = template.length > 0 ? 
      Object.keys(template[0]).map(() => ({ wch: 20 })) : [];
    worksheet['!cols'] = wscols;
    
    // Générer et télécharger le fichier
    XLSX.writeFile(workbook, `template_${type}.xlsx`);
  } catch (err) {
    console.error('Erreur lors de la génération du template:', err);
    setError('Erreur lors de la génération du template');
  }
};

  const getRequiredFields = () => {
    if (type === 'establishments') {
      return ['Nom*', 'Type*', 'Localisation*', 'Email*', 'Téléphone*'];
    } else {
      return ['Titre*', 'Type*', 'Ville*', 'Quartier*', 'Prix*', 'Nom Contact*', 'Téléphone Contact*', 'Email Contact*'];
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${type === 'establishments' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                <FileSpreadsheet className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Import {type === 'establishments' ? 'Établissements' : 'Logements'} via Excel
                </h2>
                <p className="text-sm text-gray-600">
                  Importez plusieurs {type === 'establishments' ? 'établissements' : 'logements'} en une seule fois
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

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions :</h3>
            <ol className="list-decimal list-inside space-y-1 text-blue-700 text-sm">
              <li>Téléchargez le modèle Excel pour voir le format requis</li>
              <li>Remplissez le fichier avec vos données</li>
              <li>Les champs avec * sont obligatoires</li>
              <li>Importez le fichier rempli ci-dessous</li>
              <li>Vérifiez l'aperçu avant confirmation</li>
            </ol>
          </div>

          {/* Bouton template */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-gray-900">Téléchargez le modèle</h4>
              <p className="text-sm text-gray-600">Format Excel pré-rempli avec les champs requis</p>
            </div>
            <button
              onClick={downloadTemplate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={18} />
              Télécharger Modèle
            </button>
          </div>

          {/* Champs requis */}
          <div className="p-4 border-2 border-gray-200 rounded-xl">
            <h4 className="font-medium text-gray-900 mb-2">Champs obligatoires :</h4>
            <div className="flex flex-wrap gap-2">
              {getRequiredFields().map((field) => (
                <span key={field} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm">
                  {field}
                </span>
              ))}
            </div>
          </div>

          {/* Zone de dépôt */}
          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              fileName ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            
            {fileName ? (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3 text-green-600">
                  <Check size={32} className="text-green-500" />
                  <div className="text-left">
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-gray-600">
                      {previewData.length} {type === 'establishments' ? 'établissements' : 'logements'} détectés
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Changer de fichier
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="mx-auto text-gray-400" size={48} />
                <div>
                  <p className="font-medium text-gray-700">Cliquez pour sélectionner un fichier</p>
                  <p className="text-sm text-gray-500 mt-1">Format Excel (.xlsx, .xls) ou CSV</p>
                </div>
              </div>
            )}
          </div>

          {/* Aperçu */}
          {previewData.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Aperçu des données (5 premières lignes) :</h4>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {Object.keys(previewData[0]).map((key) => (
                        <th key={key} className="px-4 py-2 text-left font-medium text-gray-700 border-b">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((value: any, idx) => (
                          <td key={idx} className="px-4 py-2 border-b">
                            {typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : String(value)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Erreurs de validation */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-red-600" size={20} />
                <h4 className="font-semibold text-red-800">Erreurs de validation :</h4>
              </div>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {validationErrors.slice(0, 10).map((error, index) => (
                  <li key={index} className="text-sm text-red-700">• {error}</li>
                ))}
                {validationErrors.length > 10 && (
                  <li className="text-sm text-red-700">
                    ... et {validationErrors.length - 10} erreurs supplémentaires
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Messages */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

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
              type="button"
              onClick={handleSubmit}
              disabled={loading || !fileName || validationErrors.length > 0}
              className={`px-6 py-3 rounded-xl transition-all flex-1 flex items-center justify-center gap-2 ${
                loading || !fileName || validationErrors.length > 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : type === 'establishments' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Import en cours...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Importer {previewData.length} {type === 'establishments' ? 'établissements' : 'logements'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}