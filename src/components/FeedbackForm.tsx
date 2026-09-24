import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { services, Complaint } from '../data/services';

interface FeedbackFormProps {
  serviceId: string | null;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

export default function FeedbackForm({ serviceId, onClose, onNavigate }: FeedbackFormProps) {
  const { t, language } = useLanguage();
  const { addComplaint, showToast } = useApp();
  const firstInputRef = useRef<HTMLInputElement>(null);
  const service = services.find(s => s.id === serviceId);

  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfVisit, setDateOfVisit] = useState(new Date().toISOString().slice(0, 10));
  const [serviceRating, setServiceRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);
  const [waitingRating, setWaitingRating] = useState(0);
  const [issueResolved, setIssueResolved] = useState('');
  const [feedback, setFeedback] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [category, setCategory] = useState('complaint');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintCode, setComplaintCode] = useState('');

  useEffect(() => {
    if (!anonymous && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [anonymous]);

  const ratingEmojis = ['😞', '😐', '🙂', '😊', '🤩'];
  const getRatingLabel = (idx: number) => {
    const labels = [t.veryPoorNe || t.veryPoor, t.poorNe || t.poor, t.averageNe || t.average, t.goodNe || t.good, t.excellentNe || t.excellent];
    return language === 'ne' ? labels[idx] : [t.veryPoor, t.poor, t.average, t.good, t.excellent][idx];
  };

  const generateCode = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `IRO-KTW-${dateStr}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || serviceRating === 0) return;
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    const code = generateCode();
    const complaint: Complaint = {
      id: generateId(),
      code,
      serviceId: service.id,
      serviceKey: service.key,
      name: anonymous ? '' : name,
      anonymous,
      pan, contact, email, dateOfVisit,
      serviceRating, staffRating, waitingRating,
      issueResolved, feedback, suggestion, category,
      status: 'submitted',
      assignedOfficer: '',
      officerDesignation: '',
      remarks: [],
      submittedAt: new Date().toISOString(),
      expectedResolution: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      finalResolution: ''
    };

    addComplaint(complaint);
    setComplaintCode(code);
    setSubmitted(true);
    setSubmitting(false);
    showToast(language === 'en' ? 'Feedback submitted!' : 'प्रतिक्रिया पेश भयो!', 'success');
  };

  const shareCode = () => {
    const text = language === 'en'
      ? `My IRO Koteshwor complaint code: ${complaintCode}`
      : `मेरो आन्तरिक राजस्व कार्यालय कोटेश्वर उजुरी कोड: ${complaintCode}`;
    if (navigator.share) {
      navigator.share({ title: 'IRO Koteshwor', text });
    } else {
      navigator.clipboard.writeText(text);
      showToast(language === 'en' ? 'Code copied!' : 'कोड प्रतिलिपि भयो!', 'success');
    }
  };

  // Success Screen
  if (submitted) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col animate-scaleIn">
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-bold text-[#1B3A6B] mb-2">
            {language === 'en' ? t.successTitle : t.successTitleNe}
          </h2>
          <p className="text-gray-600 mb-6">
            {language === 'en' ? t.successMessage : t.successMessageNe}
          </p>
          <div className="bg-gray-50 rounded-2xl p-5 w-full max-w-sm mb-6 border-2 border-dashed border-[#1B3A6B]/30">
            <p className="text-xs text-gray-500 mb-1">{language === 'en' ? t.trackCode : t.trackCodeNe}</p>
            <p className="text-xl md:text-2xl font-mono font-bold text-[#DC143C] break-all">{complaintCode}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            {language === 'en' ? t.successNote : t.successNoteNe}
          </p>
        </div>
        <div className="p-4 space-y-3 border-t safe-bottom">
          <button onClick={() => onNavigate(`track/${complaintCode}`)} className="w-full py-4 bg-[#1B3A6B] text-white rounded-xl font-bold text-base btn-3d">
            🔍 {language === 'en' ? t.trackNowBtn : t.trackNowBtn}
          </button>
          <div className="flex gap-3">
            <button onClick={shareCode} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-medium btn-3d">
              📤 {language === 'en' ? t.shareCode : t.shareCode}
            </button>
            <button onClick={() => onNavigate('home')} className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium">
              {language === 'en' ? t.backToHome : t.backToHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-navy text-white px-4 pt-6 pb-8">
        <button onClick={onClose} className="flex items-center gap-1 text-blue-200 mb-4 min-h-[44px]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">{t.cancel}</span>
        </button>
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {language === 'en' ? t.feedbackForm : t.feedbackFormNe}
          </h1>
          {service && (
            <p className="text-blue-200 text-sm flex items-center justify-center gap-2">
              <span className="text-lg">{service.icon}</span>
              {t.services[service.key]}
            </p>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Anonymous toggle */}
        <label className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 min-h-[56px] cursor-pointer">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="w-5 h-5 text-[#1B3A6B] rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            {language === 'en' ? t.submitAnonymously : t.submitAnonymouslyNe}
          </span>
        </label>

        {/* Personal Info */}
        {!anonymous && (
          <div className="space-y-3">
            <input ref={firstInputRef} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.yourName} className="input-mobile" />
            <input type="text" inputMode="numeric" value={pan} onChange={(e) => setPan(e.target.value)} placeholder={t.panNumber} className="input-mobile" />
            <input type="tel" inputMode="tel" value={contact} onChange={(e) => setContact(e.target.value)} placeholder={t.contactNumber} className="input-mobile" />
            <input type="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t.email} className="input-mobile" />
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.dateOfVisit}</label>
          <input type="date" value={dateOfVisit} onChange={(e) => setDateOfVisit(e.target.value)} className="input-mobile" />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.category}</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'praise', label: t.categoryPraise, icon: '👍' },
              { value: 'suggestion', label: t.categorySuggestion, icon: '💡' },
              { value: 'complaint', label: t.categoryComplaint, icon: '⚠️' },
              { value: 'grievance', label: t.categoryGrievance, icon: '😤' },
            ].map(cat => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`py-3 px-3 rounded-xl text-sm font-medium transition-all min-h-[48px] ${
                  category === cat.value ? 'bg-[#1B3A6B] text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-700'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D Emoji Ratings */}
        <RatingSection
          label={language === 'en' ? t.serviceExperience : t.serviceExperienceNe}
          value={serviceRating}
          onChange={setServiceRating}
          emojis={ratingEmojis}
          getLabel={getRatingLabel}
        />
        <RatingSection
          label={language === 'en' ? t.staffBehavior : t.staffBehaviorNe}
          value={staffRating}
          onChange={setStaffRating}
          emojis={ratingEmojis}
          getLabel={getRatingLabel}
        />
        <RatingSection
          label={language === 'en' ? t.waitingTime : t.waitingTimeNe}
          value={waitingRating}
          onChange={setWaitingRating}
          emojis={ratingEmojis}
          getLabel={getRatingLabel}
        />

        {/* Issue Resolved */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.issueResolved}</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'yes', label: t.yes, icon: '✅' },
              { value: 'no', label: t.no, icon: '❌' },
              { value: 'partially', label: t.partially, icon: '⚡' },
            ].map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIssueResolved(opt.value)}
                className={`py-3 px-2 rounded-xl text-sm font-medium transition-all min-h-[48px] ${
                  issueResolved === opt.value ? 'bg-[#1B3A6B] text-white shadow-md' : 'bg-white border-2 border-gray-200 text-gray-700'
                }`}
              >
                {opt.icon} {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.detailedFeedback}</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value.slice(0, 1000))}
            placeholder={t.feedbackPlaceholder}
            rows={4}
            className="input-mobile resize-none"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">{feedback.length}/1000</p>
        </div>

        {/* Suggestion */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t.suggestion}</label>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            placeholder={t.suggestionPlaceholder}
            rows={3}
            className="input-mobile resize-none"
          />
        </div>

        {/* Spacer for sticky button */}
        <div className="h-4"></div>
      </form>

      {/* Sticky Submit Button */}
      <div className="sticky-bottom-cta">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={submitting || serviceRating === 0}
          className="w-full py-4 bg-[#DC143C] hover:bg-[#a01030] disabled:bg-gray-400 text-white font-bold text-base rounded-xl btn-3d shadow-lg flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {t.submitting}
            </>
          ) : (
            <>✍️ {language === 'en' ? t.submitFeedback : t.submitFeedbackNe}</>
          )}
        </button>
      </div>
    </div>
  );
}

// 3D Emoji Rating Component
function RatingSection({ label, value, onChange, emojis, getLabel }: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  emojis: string[];
  getLabel: (idx: number) => string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">{label}</label>
      <div className="flex justify-between gap-1.5">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`emoji-btn-3d flex-1 ${value >= rating ? 'selected' : ''}`}
          >
            <span className="text-2xl md:text-3xl">{emojis[rating - 1]}</span>
            <span className={`text-[9px] md:text-[10px] mt-1 font-medium leading-tight text-center ${value >= rating ? 'text-white' : 'text-gray-500'}`}>
              {getLabel(rating - 1)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
