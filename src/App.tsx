// src/App.tsx - VERSION COMPLÈTE AVEC ADMIN ET PAGE DÉTAILS
import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { Navigation } from './components/Navigation';
import { StudySection } from './components/StudySection';
import { FormalitiesSection } from './components/FormalitiesSection';
import { HousingSection } from './components/HousingSection';
import { Footer } from './components/Footer';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { EstablishmentDetails } from './components/EstablishmentDetails'; // Import ajouté

export default function App() {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>(window.location.pathname);

  // 🔍 Détecter la route actuelle et mettre à jour l'état
  useEffect(() => {
    const path = window.location.pathname;
    setCurrentRoute(path);
    const adminPath = path.startsWith('/admin');
    setIsAdminRoute(adminPath);

    // Vérifier l'authentification existante
    const checkAdminAuth = (): boolean => {
      const hasAdminToken = localStorage.getItem('adminToken');
      const isAdminFlag = localStorage.getItem('isAdmin') === 'true';
      return !!(hasAdminToken || isAdminFlag);
    };

    setIsAdmin(checkAdminAuth());

    // Mettre à jour activeSection basé sur l'URL pour la navigation
    updateActiveSectionFromURL(path);

    // Gestion du changement d'URL
    const handleLocationChange = () => {
      const newPath = window.location.pathname;
      setCurrentRoute(newPath);
      setIsAdminRoute(newPath.startsWith('/admin'));
      updateActiveSectionFromURL(newPath);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Fonction pour mettre à jour activeSection depuis l'URL
  const updateActiveSectionFromURL = (path: string) => {
    if (path === '/' || path === '/home') {
      setActiveSection('home');
    } else if (path === '/etudier') {
      setActiveSection('etudier');
    } else if (path === '/formalites') {
      setActiveSection('formalites');
    } else if (path === '/loger') {
      setActiveSection('loger');
    }
  };

  // 🎯 Si on est sur une route admin, afficher l'admin
  if (isAdminRoute) {
    const path = window.location.pathname;
    
    if (path === '/admin/login') {
      return <AdminLogin setIsAdmin={setIsAdmin} />;
    }
    
    if (path === '/admin' || path === '/admin/dashboard') {
      return isAdmin ? <AdminDashboard /> : <AdminLogin setIsAdmin={setIsAdmin} />;
    }
    
    // Route admin inconnue
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">404 - Page admin non trouvée</h1>
          <a 
            href="/admin/login" 
            className="text-blue-600 hover:text-blue-800"
          >
            Retour à la connexion admin
          </a>
        </div>
      </div>
    );
  }

  // 🏠 Gestion des routes principales avec page de détails
  const renderContent = () => {
    const path = currentRoute;
    
    // Route pour la page de détails d'un établissement
    if (path.startsWith('/etablissements/')) {
      return <EstablishmentDetails />;
    }
    
    // Routes principales de l'application
    switch (path) {
      case '/':
      case '/home':
        return <Hero setActiveSection={setActiveSection} />;
      case '/etudier':
        return <StudySection />;
      case '/formalites':
        return <FormalitiesSection />;
      case '/loger':
        return <HousingSection />;
      default:
        // Page 404 pour les routes inconnues
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page non trouvée</h1>
              <p className="text-gray-600 mb-8">
                La page que vous cherchez n'existe pas ou a été déplacée.
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    window.location.href = '/';
                    setActiveSection('home');
                  }}
                  className="block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all mx-auto"
                >
                  Retour à l'accueil
                </button>
                <button
                  onClick={() => {
                    window.location.href = '/etudier';
                    setActiveSection('etudier');
                  }}
                  className="block px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors mx-auto"
                >
                  Voir les établissements
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  // 🏠 APPLICATION NORMALE (NON-ADMIN)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Afficher la navigation seulement si on n'est pas sur une page de détails */}
      {!currentRoute.startsWith('/etablissements/') && (
        <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />
      )}
      
      {renderContent()}
      
      {/* Afficher le footer seulement si on n'est pas sur une page de détails */}
      {!currentRoute.startsWith('/etablissements/') && <Footer />}
      
      {/* 🔗 Lien discret vers l'admin (en bas à droite) */}
      <div className="fixed bottom-4 right-4 z-40">
        <a
          href="/admin/login"
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-lg"
          title="Accès administrateur"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
          </svg>
          Admin
        </a>
      </div>
    </div>
  );
}