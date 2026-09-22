import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Header({ currentPage, onNavigate }: HeaderProps) {
  const { language, t, toggleLanguage } = useLanguage();
  const { currentUser, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md border-b-2 border-[#DC143C]">
      {/* Top government bar */}
      <div className="bg-[#1B3A6B] text-white px-3 py-1.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[10px] md:text-xs truncate">
            {t.governmentOf} | {t.ministryOf}
          </span>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-xs font-medium transition-all min-h-[32px]"
            aria-label="Toggle language"
          >
            <span>{language === 'en' ? '🇳🇵' : '🇬🇧'}</span>
            <span>{language === 'en' ? 'नेपाली' : 'EN'}</span>
          </button>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-3 py-2.5">
        <div className="flex items-center justify-between gap-2">
          {/* Logo + Title */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 min-h-[48px] flex-shrink"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#DC143C] to-[#1B3A6B] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-sm md:text-base font-bold">ने</span>
            </div>
            <div className="text-left min-w-0">
              <h1 className="text-xs md:text-sm font-bold text-[#1B3A6B] leading-tight truncate">
                {language === 'en' ? 'IRO Koteshwor' : t.siteTitle}
              </h1>
              <p className="text-[10px] md:text-xs text-gray-500 truncate">
                {language === 'en' ? t.siteTitle : t.siteSubtitle}
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { key: 'home', label: t.home },
              { key: 'track', label: t.trackComplaint },
              { key: 'contact', label: t.contact },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all min-h-[40px] ${
                  currentPage === item.key ? 'bg-[#1B3A6B] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            {currentUser ? (
              <>
                <button onClick={() => onNavigate('dashboard')} className="px-3 py-2 rounded-lg text-sm font-medium bg-[#D4AF37] text-white min-h-[40px]">
                  {t.dashboard}
                </button>
                <button onClick={logout} className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 min-h-[40px]">
                  {t.logout}
                </button>
              </>
            ) : (
              <button onClick={() => onNavigate('login')} className="px-4 py-2 rounded-lg text-sm font-medium bg-[#DC143C] text-white min-h-[40px] shadow-md">
                {t.staffLogin}
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-2.5 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-[#1B3A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <nav className="lg:hidden mt-2 pb-2 border-t pt-2 animate-fadeInUp">
            <div className="flex flex-col gap-1">
              {[
                { key: 'home', label: t.home, icon: '🏠' },
                { key: 'track', label: t.trackComplaint, icon: '🔍' },
                { key: 'contact', label: t.contact, icon: '📞' },
              ].map(item => (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key); setMenuOpen(false); }}
                  className={`px-4 py-3 rounded-lg text-sm font-medium text-left flex items-center gap-2 min-h-[48px] ${
                    currentPage === item.key ? 'bg-[#1B3A6B] text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
              {currentUser ? (
                <>
                  <button onClick={() => { onNavigate('dashboard'); setMenuOpen(false); }} className="px-4 py-3 rounded-lg text-sm font-medium text-left bg-[#D4AF37] text-white min-h-[48px]">
                    👑 {t.dashboard}
                  </button>
                  <button onClick={() => { logout(); setMenuOpen(false); }} className="px-4 py-3 rounded-lg text-sm font-medium text-left text-red-600 hover:bg-red-50 min-h-[48px]">
                    🚪 {t.logout}
                  </button>
                </>
              ) : (
                <button onClick={() => { onNavigate('login'); setMenuOpen(false); }} className="px-4 py-3 rounded-lg text-sm font-medium text-left bg-[#DC143C] text-white min-h-[48px]">
                  🔐 {t.staffLogin}
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
