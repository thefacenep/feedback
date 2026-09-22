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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'home', label: t.home },
    { key: 'services', label: t.navServices },
    { key: 'track', label: t.trackComplaint },
    { key: 'faq', label: t.faq },
    { key: 'contact', label: t.contact },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b-4 border-[#DC143C]">
      {/* Top bar */}
      <div className="bg-[#1B3A6B] text-white py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs">
          <span>{t.governmentOf} | {t.ministryOf} | {t.departmentOf}</span>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all duration-300 font-medium"
            aria-label="Toggle language"
          >
            <span className="text-base">{language === 'en' ? '🇳🇵' : '🇬🇧'}</span>
            <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
            {/* Nepal Government Emblem */}
            <div className="w-14 h-14 flex items-center justify-center">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-[#DC143C] to-[#1B3A6B] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl font-bold">ने</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#D4AF37] rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">★</span>
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-[#1B3A6B] leading-tight">
                {t.siteTitle}
              </h1>
              <p className="text-xs text-gray-600 hidden sm:block">{t.siteSubtitle}</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.key
                    ? 'bg-[#1B3A6B] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            {currentUser ? (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-3 py-2 rounded-lg text-sm font-medium bg-[#D4AF37] text-white hover:bg-[#b8960f] transition-all"
                >
                  {t.dashboard}
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="ml-2 px-4 py-2 rounded-lg text-sm font-medium bg-[#DC143C] text-white hover:bg-[#a01030] transition-all shadow-md"
              >
                {t.staffLogin}
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-[#1B3A6B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-3 pb-3 border-t pt-3 animate-fadeInUp">
            <div className="flex flex-col gap-1">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key); setMobileMenuOpen(false); }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition-all ${
                    currentPage === item.key
                      ? 'bg-[#1B3A6B] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {currentUser ? (
                <>
                  <button onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-left bg-[#D4AF37] text-white">
                    {t.dashboard}
                  </button>
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-left text-red-600 hover:bg-red-50">
                    {t.logout}
                  </button>
                </>
              ) : (
                <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-left bg-[#DC143C] text-white">
                  {t.staffLogin}
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
