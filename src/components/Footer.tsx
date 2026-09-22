import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#1B3A6B] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">ने</span>
              </div>
              <div>
                <h3 className="font-bold text-sm">{t.siteTitle}</h3>
                <p className="text-xs text-blue-200">{t.governmentOf}</p>
              </div>
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              {language === 'en'
                ? 'Committed to providing efficient, transparent, and taxpayer-friendly services.'
                : 'प्रभावकारी, पारदर्शी र करदातामैत्री सेवा प्रदान गर्न प्रतिबद्ध।'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-[#D4AF37]">{t.contactTitle}</h3>
            <div className="space-y-2 text-sm text-blue-200">
              <p className="flex items-start gap-2">
                <span>📍</span>
                <span>{t.footerAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <span>📞</span>
                <span>01-4112345, 01-4112346</span>
              </p>
              <p className="flex items-center gap-2">
                <span>📧</span>
                <span>iro.koteshwor@ird.gov.np</span>
              </p>
              <p className="flex items-center gap-2">
                <span>🌐</span>
                <span>www.ird.gov.np</span>
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-[#D4AF37]">{t.footerHours}</h3>
            <div className="space-y-2 text-sm text-blue-200">
              <p>{t.footerHoursDetail}</p>
              <p className="text-yellow-300">{t.footerClosed}</p>
            </div>
            <div className="mt-4 p-3 bg-white/5 rounded-lg">
              <p className="text-xs text-blue-200">
                {language === 'en'
                  ? '📌 Token distribution stops 30 minutes before closing time.'
                  : '📌 टोकन वितरण बन्द समयभन्दा ३० मिनेट अगाडि रोकिन्छ।'}
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm mb-4 text-[#D4AF37]">
              {language === 'en' ? 'Important Links' : 'महत्त्वपूर्ण लिंकहरू'}
            </h3>
            <div className="space-y-2 text-sm">
              <a href="https://www.ird.gov.np" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white transition-colors">
                → {language === 'en' ? 'Inland Revenue Department' : 'आन्तरिक राजस्व विभाग'}
              </a>
              <a href="https://www.taxpayerportal.ird.gov.np" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white transition-colors">
                → {language === 'en' ? 'Taxpayer Portal' : 'करदाता पोर्टल'}
              </a>
              <a href="https://www.moF.gov.np" target="_blank" rel="noopener noreferrer" className="block text-blue-200 hover:text-white transition-colors">
                → {language === 'en' ? 'Ministry of Finance' : 'वित्त मन्त्रालय'}
              </a>
              <a href="#" className="block text-blue-200 hover:text-white transition-colors">
                → {language === 'en' ? 'Tax Laws & Acts' : 'कर कानुन र ऐनहरू'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-xs text-blue-200 text-center md:text-left">
              {t.footerRights}
            </p>
            <div className="flex gap-4 text-xs text-blue-200">
              <a href="#" className="hover:text-white transition-colors">{t.footerPrivacy}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footerTerms}</a>
              <a href="#" className="hover:text-white transition-colors">{t.footerAccessibility}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
