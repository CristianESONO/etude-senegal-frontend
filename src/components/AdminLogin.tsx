// src/components/AdminLogin.tsx - VERSION CORRECTE POUR VERCEL
import { useState, useEffect } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { API_BASE_URL } from '../config/api'; // <-- AJOUT IMPORT

export function AdminLogin({ setIsAdmin }: { setIsAdmin: (value: boolean) => void }) {
  const [email, setEmail] = useState('admin@etudesenegal.sn');
  const [password, setPassword] = useState('Admin123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Vérifier l'état de l'API au chargement
  useEffect(() => {
    checkApiStatus();
    checkExistingLogin();
  }, []);

  const checkApiStatus = async () => {
    try {
      // AVANT : const response = await fetch('/api/health');
      // APRÈS :
      const response = await fetch(`${API_BASE_URL}/api/health`);
      setApiStatus(response.ok ? 'online' : 'offline');
    } catch {
      setApiStatus('offline');
    }
  };

  const checkExistingLogin = () => {
    const adminToken = localStorage.getItem('adminToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');
    
    if (adminToken && tokenExpiry) {
      // Vérifier si le token est encore valide
      const now = new Date().getTime();
      if (now < parseInt(tokenExpiry)) {
        // Token valide, rediriger vers admin
        window.location.href = '/admin';
      } else {
        // Token expiré, nettoyer
        localStorage.removeItem('adminToken');
        localStorage.removeItem('tokenExpiry');
        localStorage.removeItem('adminUser');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // AVANT : const response = await fetch('/api/users/login', {
      // APRÈS :
      const response = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          email: email.trim(), 
          password 
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Vérifier si c'est un admin
        if (data.user.role !== 'admin') {
          setError('Accès réservé aux administrateurs');
          return;
        }
        
        // ✅ Connexion réussie
        const expiryTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000); // 7 jours
        
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('tokenExpiry', expiryTime.toString());
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        localStorage.setItem('isAdmin', 'true');
        
        setIsAdmin(true);
        window.location.href = '/admin';
        
      } else {
        setError(data.message || 'Identifiants incorrects');
      }
      
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      setError('Impossible de se connecter au serveur. Vérifiez que le backend est en marche.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAdmin = async () => {
    if (!confirm('Créer un nouvel utilisateur admin?')) return;
    
    setLoading(true);
    setError('');
    
    try {
      // AVANT : const response = await fetch('/api/users/register', {
      // APRÈS :
      const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@etudesenegal.sn',
          password: 'Admin123!',
          firstName: 'Admin',
          lastName: 'System',
          phone: '+221771234567',
          role: 'admin'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('✅ Admin créé avec succès! Vous pouvez maintenant vous connecter.');
        setEmail('admin@etudesenegal.sn');
        setPassword('Admin123!');
      } else {
        setError(data.message || 'Erreur lors de la création');
      }
    } catch (error) {
      setError('Impossible de créer l\'admin. Vérifiez le backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Espace Administrateur</h1>
          <p className="text-gray-600 mt-2">Connexion sécurisée</p>
          
          {/* Indicateur de statut API */}
          <div className="mt-4 inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full" style={{
            backgroundColor: apiStatus === 'online' ? '#dcfce7' : 
                           apiStatus === 'offline' ? '#fee2e2' : '#fef3c7',
            color: apiStatus === 'online' ? '#166534' : 
                  apiStatus === 'offline' ? '#991b1b' : '#92400e'
          }}>
            {apiStatus === 'checking' ? (
              <>
                <Loader2 className="animate-spin" size={12} />
                <span>Vérification du serveur...</span>
              </>
            ) : apiStatus === 'online' ? (
              <>
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Serveur connecté</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>Serveur hors ligne</span>
              </>
            )}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email administrateur
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
              placeholder="admin@etudesenegal.sn"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100"
              placeholder="••••••••"
              required
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl animate-fade-in">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || apiStatus === 'offline'}
              className={`w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2 ${
                loading || apiStatus === 'offline' ? 'opacity-70 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>

            {apiStatus === 'offline' && (
              <button
                type="button"
                onClick={handleRegisterAdmin}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium text-sm"
              >
                Créer un compte admin
              </button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <a 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au site principal
          </a>
        </div>
      </div>
    </div>
  );
}