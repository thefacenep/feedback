import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { services } from '../data/services';

interface ComplaintTrackingProps {
  initialCode?: string;
}

export default function ComplaintTracking({ initialCode }: ComplaintTrackingProps) {
  const { t, language } = useLanguage();
  const { complaints } = useApp();
  const [code, setCode] = useState(initialCode || '');
  const [searched, setSearched] = useState(!!initialCode);
  const [error, setError] = useState('');

  const complaint = searched ? complaints.find(c => c.code === code) : null;

  const handleSearch = () => {
    if (!code.trim()) return;
    setSearched(true);
    const found = complaints.find(c => c.code === code.toUpperCase());
    if (!found) {
      setError(t.noComplaint);
      setTimeout(() => setError(''), 4000);
    }
  };

  const statusSteps = [
    { key: 'submitted', label: t.statusSubmitted },
    { key: 'under_review', label: t.statusUnderReview },
    { key: 'in_progress', label: t.statusInProgress },
    { key: 'resolved', label: t.statusResolved },
  ];

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'submitted': return 0;
      case 'under_review': return 1;
      case 'in_progress': return 2;
      case 'resolved': return 3;
      case 'rejected': return -1;
      default: return 0;
    }
  };

  const service = complaint ? services.find(s => s.id === complaint.serviceId) || null : null;

  return (
    <div className="min-h-[80vh] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Search Section */}
        <div className="bg-gradient-to-br from-[#1B3A6B] to-[#2a5298] rounded-2xl p-6 md:p-10 text-white shadow-xl mb-8">
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
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setSearched(false); }}
              placeholder={t.enterCode}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] backdrop-blur-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-[#D4AF37] hover:bg-[#b8960f] rounded-lg font-semibold transition-all duration-300 shadow-lg"
            >
              {t.trackBtn}
            </button>
          </div>
          {error && <p className="mt-3 text-red-300 text-sm text-center animate-fadeInUp">{error}</p>}
        </div>

        {/* Result Section */}
        {complaint && (
          <div className="animate-fadeInUp space-y-6">
            {/* Status Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#1B3A6B]">{t.complaintStatus}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                  complaint.status === 'rejected' ? 'bg-red-100 text-red-700' :
                  complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                  complaint.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {complaint.status === 'rejected' ? t.statusRejected : statusSteps[getStatusIndex(complaint.status)]?.label}
                </span>
              </div>

              {/* Progress Bar */}
              {complaint.status !== 'rejected' && (
                <div className="relative mb-8">
                  <div className="flex justify-between items-center">
                    {statusSteps.map((step, idx) => (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                          idx <= getStatusIndex(complaint.status)
                            ? 'bg-[#1B3A6B] text-white shadow-lg'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {idx <= getStatusIndex(complaint.status) ? '✓' : idx + 1}
                        </div>
                        <span className={`text-[10px] md:text-xs mt-2 text-center font-medium max-w-[80px] ${
                          idx <= getStatusIndex(complaint.status) ? 'text-[#1B3A6B]' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* Progress Line */}
                  <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200 rounded-full -z-0">
                    <div
                      className="h-full bg-[#1B3A6B] rounded-full transition-all duration-1000"
                      style={{ width: `${Math.max(0, (getStatusIndex(complaint.status) / (statusSteps.length - 1)) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {complaint.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <p className="text-red-700 font-medium">{t.statusRejected}</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-bold text-[#1B3A6B] mb-4 flex items-center gap-2">
                  <span>📋</span> {t.complaintCode}
                </h4>
                <div className="space-y-3">
                  <InfoRow label={t.complaintCode} value={complaint.code} mono />
                  <InfoRow label={t.submittedOn} value={new Date(complaint.submittedAt).toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US')} />
                  <InfoRow label={language === 'en' ? 'Service' : 'सेवा'} value={service ? t.services[service.key] : complaint.serviceKey} />
                  <InfoRow label={t.category} value={complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)} />
                  <InfoRow label={t.issueResolved} value={complaint.issueResolved === 'yes' ? t.yes : complaint.issueResolved === 'no' ? t.no : t.partially} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-bold text-[#1B3A6B] mb-4 flex items-center gap-2">
                  <span>⭐</span> {language === 'en' ? 'Ratings' : 'मूल्याङ्कन'}
                </h4>
                <div className="space-y-3">
                  <RatingRow label={t.serviceExperience} value={complaint.serviceRating} />
                  <RatingRow label={t.staffBehavior} value={complaint.staffRating} />
                  <RatingRow label={t.waitingTime} value={complaint.waitingRating} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-bold text-[#1B3A6B] mb-4 flex items-center gap-2">
                  <span>👤</span> {t.assignedOfficer}
                </h4>
                <div className="space-y-3">
                  <InfoRow label={language === 'en' ? 'Name' : 'नाम'} value={complaint.assignedOfficer || (language === 'en' ? 'Not yet assigned' : 'अझै तोकिएको छैन')} />
                  <InfoRow label={language === 'en' ? 'Designation' : 'पद'} value={complaint.officerDesignation || '-'} />
                  <InfoRow label={t.expectedResolution} value={complaint.expectedResolution || '-'} />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-bold text-[#1B3A6B] mb-4 flex items-center gap-2">
                  <span>💬</span> {t.remarks}
                </h4>
                <div className="space-y-2">
                  {complaint.remarks.length > 0 ? (
                    complaint.remarks.map((remark, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                        <span className="text-[#1B3A6B] mt-0.5">•</span>
                        <span className="text-sm text-gray-700">{remark}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 italic">{language === 'en' ? 'No remarks yet' : 'अझै कुनै टिप्पणी छैन'}</p>
                  )}
                </div>
                {complaint.finalResolution && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs font-medium text-green-700 mb-1">{t.finalResolution}</p>
                    <p className="text-sm text-green-800">{complaint.finalResolution}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {searched && !complaint && !error && (
          <div className="text-center py-12">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-gray-500">{t.noComplaint}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium text-gray-800 ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function RatingRow({ label, value }: { label: string; value: number }) {
  const emojis = ['😞', '😕', '😐', '🙂', '😊'];
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="flex items-center gap-1">
        <span className="text-lg">{emojis[value - 1]}</span>
        <span className="text-sm font-medium text-gray-800">{value}/5</span>
      </div>
    </div>
  );
}
