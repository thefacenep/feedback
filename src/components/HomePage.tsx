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
  const [tipsOpen, setTipsOpen] = useState(false);

  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const avgRating = complaints.length > 0 ? (complaints.reduce((a, c) => a + (c.serviceRating || 0), 0) / complaints.length).toFixed(1) : '0.0';
  const positiveFeedback = complaints.filter(c => c && c.serviceRating >= 4 && c.category === 'praise').slice(0, 6);

  return (
    <div className="pb-20 md:pb-0">
      {/* Hero Section - Mobile First */}
      <section className="bg-gradient-navy text-white px-4 pt-8 pb-10 md:pt-16 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-5 w-40 h-40 bg-[#DC143C] rounded-full blur-3xl"></div>
          <div className="absolute bottom-5 left-5 w-48 h-48 bg-[#D4AF37] rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
            <span className="text-3xl md:text-4xl">🏛️</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight">
            {language === 'en' ? t.heroTitle : t.heroTitleNe}
          </h1>
          <p className="text-sm md:text-base text-blue-100 mb-6 max-w-lg mx-auto">
            {t.heroDesc}
          </p>
          
          {/* Stacked CTA buttons for mobile */}
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <button
              onClick={() => onNavigate('feedback')}
              className="w-full py-4 px-6 bg-[#DC143C] hover:bg-[#a01030] rounded-xl font-bold text-base md:text-lg transition-all btn-3d shadow-lg"
            >
              ✍️ {language === 'en' ? t.giveFeedback : t.giveFeedbackNe}
            </button>
            <button
              onClick={() => onNavigate('track')}
              className="w-full py-4 px-6 bg-white/10 hover:bg-white/20 border-2 border-white/40 rounded-xl font-bold text-base md:text-lg transition-all backdrop-blur-sm"
            >
              🔍 {language === 'en' ? t.trackNow : t.trackNowNe}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section - 2x2 on mobile */}
      <section className="px-4 -mt-6 relative z-10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-3">
          <StatBox icon="📊" value={complaints.length} label={language === 'en' ? 'Total' : 'कुल'} color="bg-blue-50 border-blue-200" />
          <StatBox icon="✅" value={resolvedCount} label={language === 'en' ? 'Resolved' : 'समाधान'} color="bg-green-50 border-green-200" />
          <StatBox icon="⭐" value={avgRating} label={language === 'en' ? 'Rating' : 'मूल्याङ्कन'} color="bg-yellow-50 border-yellow-200" />
          <StatBox icon="⏳" value={complaints.length - resolvedCount} label={language === 'en' ? 'Pending' : 'बाँकी'} color="bg-orange-50 border-orange-200" />
        </div>
      </section>

      {/* Services Section - Mobile First */}
      <section className="px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#1B3A6B] mb-2">
              {language === 'en' ? t.servicesHeading : t.servicesHeadingNe}
            </h2>
            <p className="text-sm text-gray-600 px-2">
              {language === 'en' ? t.servicesDesc : t.servicesDescNe}
            </p>
          </div>
          
          {/* 2-column grid on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className="service-card-mobile active:scale-95 transition-transform"
              >
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-xl md:text-2xl mb-2 shadow-md`}>
                  {service.icon}
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
                  {t.services[service.key]}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Public Feedback - Horizontal Scroll */}
      {positiveFeedback.length > 0 && (
        <section className="py-6 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-lg md:text-xl font-bold text-[#1B3A6B] mb-4">
              💚 {language === 'en' ? t.publicFeedback : t.publicFeedbackNe}
            </h2>
            <div className="scroll-horizontal gap-3 pb-2">
              {positiveFeedback.map((fb, idx) => (
                <div key={idx} className="scroll-snap-item w-64 md:w-72 bg-white rounded-xl p-4 shadow-md border border-green-100 flex-shrink-0">
                  <div className="flex items-center gap-0.5 mb-2">
                    {Array.from({ length: fb.serviceRating }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-3 italic">"{fb.feedback}"</p>
                  <p className="text-xs text-gray-500">
                    {fb.anonymous ? (language === 'en' ? 'Anonymous' : 'गुमनाम') : fb.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick Tips - Accordion */}
      <section className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setTipsOpen(!tipsOpen)}
            className="w-full flex items-center justify-between p-4 bg-white rounded-xl shadow-md border border-gray-100 min-h-[56px]"
          >
            <span className="font-bold text-[#1B3A6B] flex items-center gap-2">
              💡 {language === 'en' ? t.quickTips : t.quickTipsNe}
            </span>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${tipsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {tipsOpen && (
            <div className="mt-2 p-4 bg-white rounded-xl shadow-sm border border-gray-100 animate-fadeInUp space-y-3">
              <TipItem icon="📋" text={language === 'en' ? 'Bring your PAN card for all tax services' : 'सबै कर सेवाको लागि प्यान कार्ड ल्याउनुहोस्'} />
              <TipItem icon="⏰" text={language === 'en' ? 'Visit 10-11 AM for shorter wait times' : 'छोटो प्रतीक्षाको लागि बिहान १०-११ बजे आउनुहोस्'} />
              <TipItem icon="📱" text={language === 'en' ? 'Use online portal for basic services' : 'आधारभूत सेवाको लागि अनलाइन पोर्टल प्रयोग गर्नुहोस्'} />
              <TipItem icon="🎫" text={language === 'en' ? 'Collect token from Help Desk on arrival' : 'आगमनमा सहायता कक्षबाट टोकन लिनुहोस्'} />
            </div>
          )}
        </div>
      </section>

      {/* Key Staff */}
      <section className="px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-[#1B3A6B] mb-4">
            👥 {language === 'en' ? t.keyStaff : t.keyStaffNe}
          </h2>
          <div className="space-y-3">
            <StaffCard
              name={language === 'en' ? 'Hari Prasad Pokharel' : 'हरि प्रसाद पोखरेल'}
              role={language === 'en' ? t.chiefOfficer : t.chiefOfficerNe}
              phone="01-5199296"
            />
            <StaffCard
              name={language === 'en' ? 'Sita Sharma' : 'सीता शर्मा'}
              role={language === 'en' ? t.taxOfficer : t.taxOfficerNe}
              phone="01-5199147"
            />
            <StaffCard
              name={language === 'en' ? 'Ram Bahadur Thapa' : 'राम बहादुर थापा'}
              role={language === 'en' ? t.nayabSubba : t.nayabSubbaNe}
              phone="01-5199348"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-4 py-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-bold text-[#1B3A6B] mb-4">
            📞 {language === 'en' ? t.contactTitle : t.contactTitleNe}
          </h2>
          <div className="card-mobile p-4 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">📍</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{language === 'en' ? t.officeAddress : t.officeAddressNe}</p>
                <a href="https://maps.google.com/?q=Pepsikola+Kathmandu+Nepal" target="_blank" rel="noopener noreferrer" className="text-xs text-[#1B3A6B] underline mt-1 inline-block min-h-[44px] flex items-center">
                  📍 {t.getDirections}
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">📞</span>
              <div className="space-y-1">
                <a href="tel:015199296" className="block text-sm text-[#1B3A6B] font-medium py-1 min-h-[44px] flex items-center">
                  ०१-५१९९२९६ (Call)
                </a>
                <a href="tel:015199147" className="block text-sm text-[#1B3A6B] font-medium py-1 min-h-[44px] flex items-center">
                  ०१-५१९९१४७ (Call)
                </a>
                <a href="tel:015199348" className="block text-sm text-[#1B3A6B] font-medium py-1 min-h-[44px] flex items-center">
                  ०१-५१९९३४८ (Call)
                </a>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">📧</span>
              <a href="mailto:iro-koteshwor@ird.gov.np" className="text-sm text-[#1B3A6B] font-medium min-h-[44px] flex items-center">
                iro-koteshwor@ird.gov.np
              </a>
            </div>
            
            <div className="flex items-start gap-3">
              <span className="text-xl">🕐</span>
              <div>
                <p className="text-sm text-gray-700">{language === 'en' ? t.workingHoursDetail : t.workingHoursDetailNe}</p>
                <p className="text-xs text-red-600 mt-1">{language === 'en' ? t.closedNote : t.closedNoteNe}</p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden border border-gray-200 mt-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.8!2d85.34!3d27.68!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQwJzQ4LjAiTiA4NcKwMjAnMzAuMCJF!5e0!3m2!1sen!2snp!4v1"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="IRO Koteshwor Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-nav md:hidden">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button onClick={() => onNavigate('home')} className="mobile-nav-item flex-1 active">
            <span className="text-xl">🏠</span>
            <span className="text-[10px] mt-0.5 font-medium">{t.navHome}</span>
          </button>
          <button onClick={() => onNavigate('track')} className="mobile-nav-item flex-1">
            <span className="text-xl">🔍</span>
            <span className="text-[10px] mt-0.5 font-medium">{t.navTrack}</span>
          </button>
          <button onClick={() => onNavigate('feedback')} className="mobile-nav-item flex-1 relative">
            <div className="absolute -top-3 w-12 h-12 bg-[#DC143C] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl">✍️</span>
            </div>
            <span className="text-[10px] mt-7 font-medium text-[#DC143C]">{t.navFeedback}</span>
          </button>
          <button onClick={() => onNavigate('contact')} className="mobile-nav-item flex-1">
            <span className="text-xl">📞</span>
            <span className="text-[10px] mt-0.5 font-medium">{t.navContact}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

// Sub-components
function StatBox({ icon, value, label, color }: { icon: string; value: string | number; label: string; color: string }) {
  return (
    <div className={`${color} border rounded-xl p-3 text-center`}>
      <span className="text-lg">{icon}</span>
      <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{value}</p>
      <p className="text-[10px] md:text-xs text-gray-600">{label}</p>
    </div>
  );
}

function TipItem({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2">
      <span>{icon}</span>
      <p className="text-sm text-gray-700">{text}</p>
    </div>
  );
}

function StaffCard({ name, role, phone }: { name: string; role: string; phone: string }) {
  return (
    <div className="card-mobile p-3 flex items-center gap-3">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1B3A6B] to-[#2a5298] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{name}</p>
        <p className="text-xs text-gray-500">{role}</p>
      </div>
      <a href={`tel:${phone.replace(/-/g, '')}`} className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-lg">📞</span>
      </a>
    </div>
  );
}
