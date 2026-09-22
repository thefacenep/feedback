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
  const [role, setRole] = useState<'nayab_subba' | 'tax_officer' | 'chief_tax_officer'>('nayab_subba');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = login(username, password, role);
    if (user) {
      showToast(language === 'en' ? `Welcome, ${user.name}!` : `स्वागत छ, ${user.nameNe}!`, 'success');
      onNavigate('dashboard');
    } else {
      showToast(t.invalidCredentials, 'error');
    }
    setLoading(false);
  };

  const roles = [
    { value: 'nayab_subba', label: t.nayabSubba, icon: '👤', color: 'from-blue-500 to-blue-700' },
    { value: 'tax_officer', label: t.taxOfficer, icon: '👔', color: 'from-purple-500 to-purple-700' },
    { value: 'chief_tax_officer', label: t.chiefTaxOfficer, icon: '👑', color: 'from-[#D4AF37] to-[#b8960f]' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-[#1B3A6B] to-[#2a5298] p-6 text-center text-white">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🔐</span>
            </div>
            <h2 className="text-xl font-bold">{t.staffLoginTitle}</h2>
            <p className="text-blue-200 text-sm mt-1">{t.staffLoginSubtitle}</p>
          </div>

          {/* Role Selection */}
          <div className="p-6 border-b">
            <label className="block text-sm font-medium text-gray-700 mb-3">{t.loginAs}</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value as typeof role)}
                  className={`p-3 rounded-xl text-center transition-all duration-200 ${
                    role === r.value
                      ? `bg-gradient-to-br ${r.color} text-white shadow-lg scale-105`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl block mb-1">{r.icon}</span>
                  <span className="text-[10px] font-medium leading-tight block">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.username}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent transition-all"
                placeholder={language === 'en' ? 'Enter username' : 'प्रयोगकर्ता नाम प्रविष्ट गर्नुहोस्'}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent transition-all"
                placeholder={language === 'en' ? 'Enter password' : 'पासवर्ड प्रविष्ट गर्नुहोस्'}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#DC143C] hover:bg-[#a01030] disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
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

            {/* Demo credentials */}
            <div className="bg-blue-50 rounded-lg p-3 mt-4">
              <p className="text-xs font-medium text-blue-800 mb-2">
                {language === 'en' ? '🔑 Demo Credentials:' : '🔑 डेमो प्रमाणहरू:'}
              </p>
              <div className="space-y-1 text-xs text-blue-700">
                <p><strong>{t.nayabSubba}:</strong> nayab1 / pass123</p>
                <p><strong>{t.taxOfficer}:</strong> officer1 / pass123</p>
                <p><strong>{t.chiefTaxOfficer}:</strong> chief1 / pass123</p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
