import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';

interface StaffLoginProps {
  onNavigate: (page: string) => void;
}

export default function StaffLogin({ onNavigate }: StaffLoginProps) {
  const { t, language } = useLanguage();
  const { login, showToast } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Master login only
    const user = login(username, password, 'chief_tax_officer');
    if (user) {
      showToast(language === 'en' ? `Welcome!` : 'स्वागत छ!', 'success');
      onNavigate('dashboard');
    } else {
      showToast(t.invalidCredentials, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-[#1B3A6B] to-[#2a5298] p-6 text-center text-white">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🔐</span>
            </div>
            <h2 className="text-xl font-bold">{t.staffLoginTitle}</h2>
            <p className="text-blue-200 text-sm mt-1">{t.staffLoginSubtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.username}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-mobile"
                placeholder={language === 'en' ? 'Enter Staff ID' : 'कर्मचारी आईडी'}
                required
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-mobile"
                placeholder={language === 'en' ? 'Enter password' : 'पासवर्ड'}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#DC143C] hover:bg-[#a01030] disabled:bg-gray-400 text-white font-bold text-base rounded-xl btn-3d shadow-lg flex items-center justify-center gap-2 min-h-[52px]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  {language === 'en' ? 'Logging in...' : 'लगइन गर्दै...'}
                </>
              ) : t.login}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
