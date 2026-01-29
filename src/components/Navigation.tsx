import { GraduationCap, FileText, Home as HomeIcon, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavigationProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export function Navigation({ activeSection, setActiveSection }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: HomeIcon, path: '/' },
    { id: 'etudier', label: 'Étudier', icon: GraduationCap, path: '/etudier' },
    { id: 'formalites', label: 'Formalités', icon: FileText, path: '/formalites' },
    { id: 'loger', label: 'Se Loger', icon: HomeIcon, path: '/loger' },
  ];

  const handleNavClick = (sectionId: string, path: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    
    // Mettre à jour l'URL sans recharger la page
    window.history.pushState({}, '', path);
    // Déclencher un événement pour que App.tsx détecte le changement
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => handleNavClick('home', '/')}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Etude<span className="text-blue-600">Sénégal</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.path)}
                  className={`px-6 py-2 rounded-xl flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
            
            {/* Bouton Contact */}
            <button
              onClick={() => window.location.href = '#contact'}
              className="ml-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Nous contacter
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.path)}
                  className={`w-full px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
            
            {/* Bouton Contact Mobile */}
            <div className="pt-4 border-t">
              <button
                onClick={() => {
                  window.location.href = '#contact';
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Nous contacter
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}