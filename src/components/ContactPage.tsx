import { useLanguage } from '../contexts/LanguageContext';

export default function ContactPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#1B3A6B] mb-2">{t.contactTitle}</h1>
          <p className="text-gray-600">{t.contactSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-[#1B3A6B] mb-4 flex items-center gap-2">
                <span className="text-xl">🏢</span>
                {language === 'en' ? 'Office Address' : 'कार्यालय ठेगाना'}
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p className="flex items-start gap-3">
                  <span className="text-lg">📍</span>
                  <span>
                    {language === 'en'
                      ? 'Inland Revenue Office, Koteshwor, Kathmandu, Nepal'
                      : 'आन्तरिक राजस्व कार्यालय, कोटेश्वर, काठमाडौं, नेपाल'}
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-lg">📞</span>
                  <span>01-4112345, 01-4112346</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-lg">📠</span>
                  <span>01-4112347</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-lg">📧</span>
                  <span>iro.koteshwor@ird.gov.np</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-[#1B3A6B] mb-4 flex items-center gap-2">
                <span className="text-xl">🕐</span>
                {t.footerHours}
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>{language === 'en' ? 'Sunday - Friday' : 'आइतबार - शुक्रबार'}</span>
                  <span className="font-medium">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span>{language === 'en' ? 'Saturday' : 'शनिबार'}</span>
                  <span className="font-medium text-red-600">{language === 'en' ? 'Closed' : 'बन्द'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>{language === 'en' ? 'Public Holidays' : 'सार्वजनिक बिदा'}</span>
                  <span className="font-medium text-red-600">{language === 'en' ? 'Closed' : 'बन्द'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-[#1B3A6B] mb-4 flex items-center gap-2">
                <span className="text-xl">👥</span>
                {language === 'en' ? 'Key Personnel' : 'प्रमुख कर्मचारीहरू'}
              </h3>
              <div className="space-y-3">
                {[
                  { name: language === 'en' ? 'Hari Prasad Pokharel' : 'हरि प्रसाद पोखरेल', role: language === 'en' ? 'Chief Tax Officer' : 'प्रमुख कर अधिकृत', ext: '101' },
                  { name: language === 'en' ? 'Sita Sharma' : 'सीता शर्मा', role: language === 'en' ? 'Tax Officer' : 'कर अधिकृत', ext: '102' },
                  { name: language === 'en' ? 'Ram Bahadur Thapa' : 'राम बहादुर थापा', role: language === 'en' ? 'Nayab Subba' : 'नायब सुब्बा', ext: '103' },
                ].map((person, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center text-xs font-bold">
                      {person.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{person.name}</p>
                      <p className="text-xs text-gray-500">{person.role} (Ext: {person.ext})</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map / Location */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="bg-gradient-to-br from-[#1B3A6B] to-[#2a5298] p-6 text-white text-center">
                <div className="text-5xl mb-3">🗺️</div>
                <h3 className="font-bold text-lg mb-2">{language === 'en' ? 'Location Map' : 'स्थान नक्सा'}</h3>
                <p className="text-sm text-blue-200">
                  {language === 'en'
                    ? 'Koteshwor, on the Ring Road, Kathmandu'
                    : 'कोटेश्वर, रिङ रोड, काठमाडौं'}
                </p>
              </div>
              <div className="p-4">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-4xl">📍</span>
                    <p className="text-sm text-gray-600 mt-2">
                      {language === 'en' ? 'Koteshwor, Kathmandu' : 'कोटेश्वर, काठमाडौं'}
                    </p>
                    <p className="text-xs text-gray-500">27.6748° N, 85.3418° E</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-[#1B3A6B] mb-4 flex items-center gap-2">
                <span className="text-xl">🚌</span>
                {language === 'en' ? 'How to Reach' : 'कसरी पुग्ने'}
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p className="flex items-start gap-2">
                  <span>🚏</span>
                  <span>{language === 'en' ? 'Bus: Ring Road buses stop at Koteshwor' : 'बस: रिङ रोड बस कोटेश्वरमा रोकिन्छ'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span>🚕</span>
                  <span>{language === 'en' ? 'Taxi: Ask for IRO Koteshwor' : 'ट्याक्सी: आन्तरिक राजस्व कार्यालय कोटेश्वर भन्नुहोस्'}</span>
                </p>
                <p className="flex items-start gap-2">
                  <span>🅿️</span>
                  <span>{language === 'en' ? 'Parking available inside the premises' : 'परिसर भित्र पार्किङ उपलब्ध'}</span>
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-xl border border-[#D4AF37]/30 p-6">
              <h3 className="font-bold text-[#1B3A6B] mb-3 flex items-center gap-2">
                <span className="text-xl">💡</span>
                {language === 'en' ? 'Quick Tips' : 'छिटो सुझावहरू'}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {language === 'en' ? 'Bring your PAN card for all tax-related services' : 'सबै कर सम्बन्धी सेवाहरूको लागि प्यान कार्ड ल्याउनुहोस्'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {language === 'en' ? 'Visit during off-peak hours (10-11 AM) for shorter wait times' : 'छोटो प्रतीक्षा समयको लागि अफ-पिक समयमा (बिहान १०-११) आउनुहोस्'}
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {language === 'en' ? 'Use the online portal for basic services when possible' : 'सम्भव भए आधारभूत सेवाहरूको लागि अनलाइन पोर्टल प्रयोग गर्नुहोस्'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
