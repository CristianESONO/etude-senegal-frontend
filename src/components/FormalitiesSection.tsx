import { FileText, CheckCircle, Clock, AlertCircle, Calendar, CreditCard, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

export function FormalitiesSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'visa' | 'carte'>('visa');

  const faqItems = [
    {
      question: 'Combien de temps faut-il pour obtenir un visa étudiant ?',
      answer: 'Le processus complet prend généralement entre 3 et 6 semaines. Il est recommandé de commencer vos démarches au moins 3 mois avant votre date de départ prévue.',
      category: 'visa',
    },
    {
      question: 'Quel est le coût total des démarches ?',
      answer: 'Les frais de visa s\'élèvent à environ 60 euros (40,000 FCFA). Pour la carte de séjour, comptez 25,000 FCFA. Au total, prévoyez environ 75,000 FCFA pour l\'ensemble des démarches.',
      category: 'visa',
    },
    {
      question: 'Puis-je travailler avec un visa étudiant ?',
      answer: 'Oui, les étudiants étrangers peuvent travailler à temps partiel (maximum 20h/semaine) avec l\'autorisation de la Direction du Travail.',
      category: 'visa',
    },
    {
      question: 'Dois-je renouveler ma carte de séjour chaque année ?',
      answer: 'Oui, la carte de séjour étudiant est valable un an et doit être renouvelée annuellement. Le renouvellement doit être demandé 2 mois avant l\'expiration.',
      category: 'carte',
    },
    {
      question: 'Que faire en cas de perte de ma carte de séjour ?',
      answer: 'En cas de perte, déclarez-la immédiatement à la police et à la DPETV. Un duplicata peut être obtenu moyennant des frais supplémentaires (environ 15,000 FCFA).',
      category: 'carte',
    },
    {
      question: 'Puis-je voyager hors du Sénégal avec ma carte de séjour ?',
      answer: 'Oui, votre carte de séjour vous permet de sortir et de revenir au Sénégal. Assurez-vous que votre passeport et votre carte sont valides.',
      category: 'carte',
    },
  ];

  const visaSteps = [
    {
      step: 1,
      title: 'Lettre d\'admission',
      description: 'Obtenir une lettre d\'admission d\'un établissement reconnu au Sénégal',
      duration: '1-2 semaines',
      icon: FileText,
    },
    {
      step: 2,
      title: 'Dossier de visa',
      description: 'Constituer le dossier complet avec passeport, photos, certificats médicaux',
      duration: '3-5 jours',
      icon: CheckCircle,
    },
    {
      step: 3,
      title: 'Dépôt de demande',
      description: 'Déposer la demande à l\'ambassade ou consulat du Sénégal',
      duration: '1 jour',
      icon: Calendar,
    },
    {
      step: 4,
      title: 'Traitement',
      description: 'Attendre le traitement de la demande par les autorités',
      duration: '2-4 semaines',
      icon: Clock,
    },
  ];

  const carteSejourDocs = [
    'Passeport en cours de validité',
    'Visa d\'entrée',
    'Lettre d\'admission de l\'établissement',
    'Justificatif de domicile au Sénégal',
    'Certificat médical',
    'Extrait de casier judiciaire',
    '4 photos d\'identité récentes',
    'Frais de dossier (25,000 FCFA)',
  ];

  const importantNotes = [
    {
      title: 'Délais',
      description: 'Commencez vos démarches au moins 3 mois avant votre départ prévu',
      icon: Clock,
      color: 'blue',
    },
    {
      title: 'Validité',
      description: 'La carte de séjour étudiant est valable 1 an, renouvelable',
      icon: Calendar,
      color: 'indigo',
    },
    {
      title: 'Frais',
      description: 'Prévoir environ 50,000 FCFA pour l\'ensemble des démarches',
      icon: CreditCard,
      color: 'purple',
    },
  ];

  // Filter FAQ based on search and active tab
  const filteredFaq = faqItems.filter((item) => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = item.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl text-gray-900 mb-4">Formalités Administratives</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur le visa étudiant et la carte de séjour au Sénégal
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher des informations sur les formalités..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-gray-900"
            />
          </div>
        </div>

    {/* Hero Image */}
    <div className="mb-16 rounded-2xl overflow-hidden shadow-2xl">
      <ImageWithFallback
        src="/assets/passeport.avif"
        alt="Portrait homme noir africain"
        className="w-full h-96 object-cover"
      />
    </div>




        {/* Important Notes */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {importantNotes.map((note) => {
            const Icon = note.icon;
            return (
              <div key={note.title} className={`bg-gradient-to-br from-${note.color}-50 to-${note.color}-100 border-2 border-${note.color}-200 rounded-xl p-6`}>
                <Icon className={`text-${note.color}-600 mb-3`} size={32} />
                <h3 className="text-xl text-gray-900 mb-2">{note.title}</h3>
                <p className="text-gray-700">{note.description}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('visa')}
            className={`flex-1 px-6 py-4 rounded-xl transition-all ${
              activeTab === 'visa'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <FileText className="inline-block mr-2" size={20} />
            Visa Étudiant
          </button>
          <button
            onClick={() => setActiveTab('carte')}
            className={`flex-1 px-6 py-4 rounded-xl transition-all ${
              activeTab === 'carte'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <CheckCircle className="inline-block mr-2" size={20} />
            Carte de Séjour
          </button>
        </div>

        {/* Visa Process Section */}
        {activeTab === 'visa' && (
          <div className="mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-2xl p-8 text-white">
              <h2 className="text-3xl mb-2">Obtenir un Visa Étudiant</h2>
              <p className="text-blue-100">Processus étape par étape pour obtenir votre visa</p>
            </div>

            <div className="bg-white rounded-b-2xl shadow-xl p-8">
              <div className="space-y-6">
                {visaSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === visaSteps.length - 1;
                  return (
                    <div key={step.step} className="relative">
                      <div className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-10">
                            {step.step}
                          </div>
                          {!isLast && (
                            <div className="w-0.5 h-full bg-gradient-to-b from-blue-300 to-indigo-300 mt-2" />
                          )}
                        </div>

                        <div className="flex-1 pb-8">
                          <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-xl text-gray-900">{step.title}</h3>
                              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                                <Clock size={14} />
                                <span className="text-sm">{step.duration}</span>
                              </div>
                            </div>
                            <p className="text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Carte de Séjour Section */}
        {activeTab === 'carte' && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
              <h2 className="text-3xl mb-2">Carte de Séjour Étudiant</h2>
              <p className="text-purple-100">Documents nécessaires pour votre carte de séjour</p>
            </div>

            <div className="p-8">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="text-amber-600 flex-shrink-0" size={24} />
                  <div>
                    <h3 className="text-lg text-gray-900 mb-2">Important</h3>
                    <p className="text-gray-700">
                      La demande de carte de séjour doit être déposée dans les 3 mois suivant votre arrivée au Sénégal. 
                      Un récépissé vous sera délivré en attendant la carte définitive.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl text-gray-900 mb-6">Documents requis</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {carteSejourDocs.map((doc) => (
                  <div key={doc} className="flex items-center gap-3 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                    <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                    <span className="text-gray-800">{doc}</span>
                  </div>
                ))}
              </div>

            
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl text-gray-900 mb-6">Questions Fréquentes</h2>
          
          {filteredFaq.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune question trouvée</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaq.map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-gray-100 rounded-xl overflow-hidden hover:border-blue-200 transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg text-gray-900 pr-4">{item.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="text-blue-600 flex-shrink-0" size={24} />
                    ) : (
                      <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 py-4 bg-gray-50 border-t-2 border-gray-100">
                      <p className="text-gray-700">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

       {/* Help Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl mb-4">Besoin d'aide avec vos démarches ?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Notre équipe est là pour vous accompagner dans toutes vos formalités administratives
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
                href="https://wa.me/711457304?text=Bonjour,%20j'ai%20besoin%20d'aide%20pour%20les%20formalités%20administratives%20(visa%20et%20carte%20de%20séjour)%20au%20Sénégal."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-lg flex items-center gap-3 font-medium"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.032 0c-6.626 0-12 5.372-12 12 0 2.126.553 4.144 1.527 5.946l-1.458 5.383 5.524-1.458c1.757.951 3.756 1.465 5.894 1.465 6.627 0 12-5.372 12-12s-5.373-12-12-12zm5.633 17.018c-.329.925-1.61 1.689-2.635 1.761-.815.057-1.839-.205-3.475-.75-2.373-.795-4.294-2.857-4.855-5.116-.374-1.506.022-2.758.824-3.642.467-.514 1.12-.803 1.814-.803.246 0 .486.039.705.113.374.125.714.428.936.811.329.577.369.738.722 1.353.277.479.466.86.668 1.176.21.33.425.669.63.949.229.309.464.64.766.94.301.299.593.446.973.446.146 0 .29-.019.429-.057.773-.21 1.462-.925 1.69-1.699.21-.725.084-1.34-.374-1.861-.319-.366-.738-.596-1.169-.596-.146 0-.291.039-.425.113-.104.057-.192.104-.291.104-.126 0-.317-.15-.483-.33-.41-.442-.75-1.028-1.048-1.703-.226-.524-.016-1.297.525-1.716.301-.236.648-.354.997-.354 1.247 0 2.326.842 2.782 1.923.374.876.412 1.89.105 2.817z"/>
                </svg>
                Assistance pour les formalités
              </a>
            
            <a 
              href="/guides/formalites-etudiantes-senegal.pdf"
              download="Guide_Formalités_Sénégal.pdf"
              className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm border-2 border-white/30 rounded-xl hover:bg-blue-500/30 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3h-2v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-2.5v-1.5c0-2.48-2.02-4.5-4.5-4.5-.93 0-1.79.28-2.5.76l1.45 1.45C9.39 8.47 10.17 8.5 11 8.5c1.93 0 3.5 1.57 3.5 3.5v1.5h-9c-.55 0-1 .45-1 1s.45 1 1 1h9v2H6c-1.66 0-3-1.34-3-3s1.34-3 3-3h1.5v-1.5c0-3.43 2.73-6.22 6.15-6.49C14.3 3.45 15.07 3 16 3c1.66 0 3 1.34 3 3s-1.34 3-3 3h-1v2h1c1.1 0 2 .9 2 2s-.9 2-2 2h-1v2h1c2.21 0 4-1.79 4-4 0-1.85-1.26-3.4-2.65-3.96z"/>
              </svg>
              Télécharger le guide
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}