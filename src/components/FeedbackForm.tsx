import { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { services, Complaint } from '../data/services';
import { v4 as uuidv4 } from 'uuid';

interface FeedbackFormProps {
  serviceId: string | null;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export default function FeedbackForm({ serviceId, onClose, onNavigate }: FeedbackFormProps) {
  const { t, language } = useLanguage();
  const { addComplaint, showToast } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [complaintCode, setComplaintCode] = useState('');

  const ratingEmojis = ['😞', '😕', '😐', '🙂', '😊'];
  const ratingLabels = [t.veryPoor, t.poor, t.average, t.good, t.excellent];

  const generateCode = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `IRO-KTW-${dateStr}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const code = generateCode();
    const complaint: Complaint = {
      id: uuidv4(),
      code,
      serviceId: service.id,
      serviceKey: service.key,
      name: anonymous ? '' : name,
      anonymous,
      pan,
      contact,
      email,
      dateOfVisit,
      serviceRating,
      staffRating,
      waitingRating,
      issueResolved,
      feedback,
      suggestion,
      category,
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
    showToast(language === 'en' ? 'Feedback submitted successfully!' : 'प्रतिक्रिया सफलतापूर्वक पेश भयो!', 'success');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast(language === 'en' ? 'File size exceeds 5MB' : 'फाइलको आकार ५MB भन्दा बढी छ', 'error');
        return;
      }
      setFileName(file.name);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center animate-fadeInUp">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1B3A6B] mb-3">{t.successTitle}</h2>
          <p className="text-gray-600 mb-4">{t.successMessage}</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-500 mb-1">{t.trackCode}:</p>
            <p className="text-xl font-mono font-bold text-[#DC143C]">{complaintCode}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">{t.successNote}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onNavigate(`track/${complaintCode}`)}
              className="flex-1 px-4 py-2.5 bg-[#1B3A6B] text-white rounded-lg font-medium hover:bg-[#0f2347] transition-all"
            >
              {t.trackNow}
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              {t.backToHome}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#1B3A6B] to-[#2a5298] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{t.feedbackForm}</h2>
                {service && (
                  <p className="text-blue-200 mt-1 flex items-center gap-2">
                    <span className="text-lg">{service.icon}</span>
                    {t.services[service.key]}
                  </p>
                )}
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Anonymous toggle */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="anonymous"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="w-4 h-4 text-[#1B3A6B] rounded focus:ring-[#1B3A6B]"
              />
              <label htmlFor="anonymous" className="text-sm font-medium text-gray-700 cursor-pointer">
                {t.submitAnonymously}
              </label>
            </div>

            {/* Personal Info */}
            {!anonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.yourName} {t.optional}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.panNumber} {t.optional}</label>
                  <input type="text" value={pan} onChange={(e) => setPan(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.contactNumber} {t.optional}</label>
                  <input type="tel" value={contact} onChange={(e) => setContact(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.email} {t.optional}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent transition-all" />
                </div>
              </div>
            )}

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.dateOfVisit}</label>
              <input type="date" value={dateOfVisit} onChange={(e) => setDateOfVisit(e.target.value)} className="w-full md:w-64 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent transition-all" />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.category}</label>
              <div className="flex flex-wrap gap-2">
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
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      category === cat.value
                        ? 'bg-[#1B3A6B] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ratings */}
            <div className="space-y-5">
              <RatingInput label={t.serviceExperience} value={serviceRating} onChange={setServiceRating} emojis={ratingEmojis} labels={ratingLabels} />
              <RatingInput label={t.staffBehavior} value={staffRating} onChange={setStaffRating} emojis={ratingEmojis} labels={ratingLabels} />
              <RatingInput label={t.waitingTime} value={waitingRating} onChange={setWaitingRating} emojis={ratingEmojis} labels={ratingLabels} />
            </div>

            {/* Issue Resolved */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.issueResolved}</label>
              <div className="flex gap-3">
                {[
                  { value: 'yes', label: t.yes, icon: '✅' },
                  { value: 'no', label: t.no, icon: '❌' },
                  { value: 'partially', label: t.partially, icon: '⚡' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setIssueResolved(opt.value)}
                    className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                      issueResolved === opt.value
                        ? 'bg-[#1B3A6B] text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.detailedFeedback}</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value.slice(0, 1000))}
                placeholder={t.feedbackPlaceholder}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent transition-all resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">{feedback.length}/1000 {t.characters}</p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.uploadDocument} {t.optional}</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#1B3A6B] transition-colors cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                {fileName ? (
                  <p className="text-sm text-green-600 font-medium">📎 {fileName}</p>
                ) : (
                  <div>
                    <span className="text-2xl">📁</span>
                    <p className="text-sm text-gray-500 mt-1">{t.uploadHint}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Suggestion */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.suggestion} {t.optional}</label>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder={t.suggestionPlaceholder}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <button
                type="submit"
                disabled={submitting || serviceRating === 0}
                className="flex-1 py-3 px-6 bg-[#DC143C] hover:bg-[#a01030] disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    {t.submitting}
                  </>
                ) : t.submitFeedback}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function RatingInput({ label, value, onChange, emojis, labels }: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  emojis: string[];
  labels: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(rating => (
          <button
            key={rating}
            type="button"
            onClick={() => onChange(rating)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
              value >= rating
                ? 'bg-[#1B3A6B]/10 scale-110 shadow-sm'
                : 'hover:bg-gray-100'
            }`}
          >
            <span className={`text-2xl ${value >= rating ? '' : 'grayscale opacity-50'}`}>{emojis[rating - 1]}</span>
            <span className={`text-[10px] mt-0.5 font-medium ${value >= rating ? 'text-[#1B3A6B]' : 'text-gray-400'}`}>
              {labels[rating - 1]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
