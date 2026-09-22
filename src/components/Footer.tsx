import { useLanguage } from '../contexts/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#1B3A6B] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">ने</span>
              </div>
              <div>
                <h3 className="font-bold text-sm">{language === 'en' ? 'IRO Koteshwor' : t.siteTitle}</h3>
                <p className="text-[10px] text-blue-200">{t.governmentOf}</p>
              </div>
            </div>
            <p className="text-xs text-blue-200 leading-relaxed">
              {language === 'en' ? 'Committed to efficient, transparent services for all service recipients.' : 'सबै सेवाग्राहीहरूलाई प्रभावकारी, पारदर्शी सेवा प्रदान गर्न प्रतिबद्ध।'}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-[#D4AF37]">{language === 'en' ? t.contactTitle : t.contactTitleNe}</h3>
            <div className="space-y-1.5 text-xs text-blue-200">
              <p>📍 {language === 'en' ? t.officeAddress : t.officeAddressNe}</p>
              <p>📞 <a href="tel:015199296" className="hover:text-white">०१-५१९९२९६</a></p>
              <p>📧 <a href="mailto:iro-koteshwor@ird.gov.np" className="hover:text-white">iro-koteshwor@ird.gov.np</a></p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-[#D4AF37]">{language === 'en' ? t.workingHours : t.workingHours}</h3>
            <div className="space-y-1.5 text-xs text-blue-200">
              <p>{language === 'en' ? t.workingHoursDetail : t.workingHoursDetailNe}</p>
              <p className="text-yellow-300">{language === 'en' ? t.closedNote : t.closedNoteNe}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <p className="text-[10px] text-blue-200 text-center">
            {language === 'en' ? t.footerRights : t.footerRightsNe}
          </p>
        </div>
      </div>
    </footer>
  );
}
