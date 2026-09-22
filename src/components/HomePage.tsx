import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { services } from '../data/services';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSelectService: (serviceId: string) => void;
}

export default function HomePage({ onNavigate, onSelectService }: HomePageProps) {
  const { t, language } = useLanguage();
  const { complaints } = useApp();
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingError, setTrackingError] = useState('');

  const handleTrack = () => {
    const found = complaints.find(c => c.code === trackingCode);
    if (found) {
      onNavigate(`track/${trackingCode}`);
    } else {
      setTrackingError(t.noComplaint);
      setTimeout(() => setTrackingError(''), 4000);
    }
  };

  // Get positive feedback for the wall
  const positiveFeedback = complaints
    .filter(c => c.serviceRating >= 4 && c.category === 'praise')
    .slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1B3A6B] via-[#2a5298] to-[#1B3A6B] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#DC143C] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fadeInUp">
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                {t.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-3">
                {t.heroSubtitle}
              </p>
              <p className="text-sm md:text-base text-blue-200 mb-8">
                {t.heroDesc}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigate('services')}
                  className="px-6 py-3 bg-[#DC143C] hover:bg-[#a01030] rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {t.giveFeedback}
                </button>
                <button
                  onClick={() => onNavigate('track')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm"
                >
                  {t.trackNow}
                </button>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative animate-float">
                <div className="w-64 h-64 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-3">🏛️</div>
                    <p className="text-sm font-medium text-blue-100">
                      {language === 'en' ? 'Inland Revenue Office' : 'आन्तरिक राजस्व कार्यालय'}
                    </p>
                    <p className="text-xs text-blue-200 mt-1">
                      {language === 'en' ? 'Koteshwor, Kathmandu' : 'कोटेश्वर, काठमाडौं'}
                    </p>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-[#DC143C] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">💬</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3">
              <div className="text-2xl md:text-3xl font-bold text-[#1B3A6B]">{complaints.length}</div>
              <div className="text-xs md:text-sm text-gray-600">{t.totalComplaints}</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl md:text-3xl font-bold text-green-600">{complaints.filter(c => c.status === 'resolved').length}</div>
              <div className="text-xs md:text-sm text-gray-600">{t.resolvedComplaints}</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl md:text-3xl font-bold text-[#D4AF37]">{(complaints.reduce((a, c) => a + c.serviceRating, 0) / complaints.length).toFixed(1)}</div>
              <div className="text-xs md:text-sm text-gray-600">{t.avgSatisfaction}</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl md:text-3xl font-bold text-[#DC143C]">{complaints.filter(c => c.status === 'submitted' || c.status === 'under_review').length}</div>
              <div className="text-xs md:text-sm text-gray-600">{t.pendingComplaints}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B3A6B] mb-2">{t.ourServices}</h2>
            <p className="text-gray-600">{t.servicesDesc}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {services.map((service, idx) => (
              <div
                key={service.id}
                className="service-card bg-white rounded-xl p-5 shadow-md border border-gray-100 cursor-pointer group"
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => onSelectService(service.id)}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1 leading-tight">
                  {t.services[service.key]}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {language === 'en' ? service.id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : t.services[service.key]}
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); onSelectService(service.id); }}
                  className="w-full py-2 px-3 bg-[#1B3A6B] hover:bg-[#0f2347] text-white text-xs font-medium rounded-lg transition-all duration-200 group-hover:shadow-md"
                >
                  {t.giveFeedbackBtn}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Complaint Section */}
      <section id="track" className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gradient-to-br from-[#1B3A6B] to-[#2a5298] rounded-2xl p-6 md:p-10 text-white shadow-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{t.trackTitle}</h2>
              <p className="text-blue-200 text-sm">{t.trackSubtitle}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase())}
                placeholder={t.enterCode}
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] backdrop-blur-sm"
              />
              <button
                onClick={handleTrack}
                className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b8960f] rounded-lg font-semibold transition-all duration-300 shadow-lg"
              >
                {t.trackBtn}
              </button>
            </div>
            {trackingError && (
              <p className="mt-3 text-red-300 text-sm animate-fadeInUp">{trackingError}</p>
            )}
            <p className="mt-4 text-xs text-blue-200 text-center">
              {language === 'en' ? 'Example: IRO-KTW-20250115-A3F7' : 'उदाहरण: IRO-KTW-20250115-A3F7'}
            </p>
          </div>
        </div>
      </section>

      {/* Public Feedback Wall */}
      {positiveFeedback.length > 0 && (
        <section className="py-12 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-[#1B3A6B] mb-2">{t.feedbackWall}</h2>
              <p className="text-gray-600 text-sm">{t.feedbackWallDesc}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {positiveFeedback.map((fb, idx) => (
                <div key={idx} className="bg-white rounded-xl p-4 shadow-md border border-green-100">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: fb.serviceRating }).map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mb-3 italic">"{fb.feedback}"</p>
                  <p className="text-xs text-gray-500">
                    {fb.anonymous ? (language === 'en' ? 'Anonymous Visitor' : 'गुमनाम आगन्तुक') : fb.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section id="faq" className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1B3A6B] mb-2">{t.faqTitle}</h2>
            <p className="text-gray-600">{t.faqSubtitle}</p>
          </div>
          <FAQSection />
        </div>
      </section>
    </div>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { language } = useLanguage();

  const faqs = [
    {
      q: language === 'en' ? 'How do I file a complaint?' : 'म कसरी उजुरी दर्ता गर्न सक्छु?',
      a: language === 'en'
        ? 'Click on any service card on the homepage, fill out the feedback form, and submit. You will receive a unique complaint code to track your complaint.'
        : 'गृहपृष्ठमा कुनै पनि सेवा कार्डमा क्लिक गर्नुहोस्, प्रतिक्रिया फारम भर्नुहोस् र पेश गर्नुहोस्। तपाईंले तपाईंको उजुरी ट्र्याक गर्न एक अद्वितीय उजुरी कोड प्राप्त गर्नुहुनेछ।'
    },
    {
      q: language === 'en' ? 'How long does it take to resolve a complaint?' : 'उजुरी समाधान गर्न कति समय लाग्छ?',
      a: language === 'en'
        ? 'Simple complaints are typically resolved within 7 working days. Complex cases may take up to 30 days. You can track the status using your complaint code.'
        : 'साधा उजुरीहरू सामान्यतया ७ कार्य दिनभित्र समाधान गरिन्छ। जटिल मामिलाहरूमा ३० दिनसम्म लाग्न सक्छ। तपाईं आफ्नो उजुरी कोड प्रयोग गरेर स्थिति ट्र्याक गर्न सक्नुहुन्छ।'
    },
    {
      q: language === 'en' ? 'Can I submit feedback anonymously?' : 'के म गुमनाम रूपमा प्रतिक्रिया पेश गर्न सक्छु?',
      a: language === 'en'
        ? 'Yes, you can check the "Submit Anonymously" option in the feedback form. Your identity will not be stored or shared.'
        : 'हो, तपाईं प्रतिक्रिया फारममा "गुमनाम रूपमा पेश गर्ने" विकल्प चेक गर्न सक्नुहुन्छ। तपाईंको पहिचान भण्डारण वा साझेदारी गरिने छैन।'
    },
    {
      q: language === 'en' ? 'What documents can I upload?' : 'म कुन कागजातहरू अपलोड गर्न सक्छु?',
      a: language === 'en'
        ? 'You can upload supporting documents or images (PDF, JPG, PNG) up to 5MB to support your complaint.'
        : 'तपाईं आफ्नो उजुरीको समर्थन गर्न सहायक कागजातहरू वा तस्बिरहरू (PDF, JPG, PNG) अधिकतम ५MB अपलोड गर्न सक्नुहुन्छ।'
    },
    {
      q: language === 'en' ? 'What are the office working hours?' : 'कार्यालय समय कति हो?',
      a: language === 'en'
        ? 'IRO Koteshwor is open Sunday to Friday, 10:00 AM to 5:00 PM. Closed on Saturdays and public holidays.'
        : 'आन्तरिक राजस्व कार्यालय कोटेश्वर आइतबारदेखि शुक्रबारसम्म, बिहान १०:०० बजेदेखि अपरान्ह ५:०० बजेसम्म खुल्छ। शनिबार र सार्वजनिक बिदामा बन्द।'
    },
    {
      q: language === 'en' ? 'How do I get my PAN card?' : 'म कसरी प्यान कार्ड प्राप्त गर्न सक्छु?',
      a: language === 'en'
        ? 'Visit the Help Desk or use the Personal PAN Registration service. Bring your citizenship certificate and a passport-size photo.'
        : 'करदाता सहायता कक्षमा जानुहोस् वा व्यक्तिगत प्यान बनाउने सेवा प्रयोग गर्नुहोस्। आफ्नो नागरिकता प्रमाणपत्र र पासपोर्ट साइजको फोटो ल्याउनुहोस्।'
    }
  ];

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-800 text-sm md:text-base">{faq.q}</span>
            <svg className={`w-5 h-5 text-[#1B3A6B] transition-transform duration-300 ${openIdx === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIdx === idx && (
            <div className="px-5 pb-4 text-sm text-gray-600 animate-fadeInUp">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
