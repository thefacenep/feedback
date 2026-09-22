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

  const complaint = searched ? complaints.find(c => c.code === code.toUpperCase()) : null;

  const handleSearch = () => {
    if (!code.trim()) return;
    setSearched(true);
    if (!complaints.find(c => c.code === code.toUpperCase())) {
      setError(language === 'en' ? t.noComplaint : t.noComplaintNe);
      setTimeout(() => setError(''), 4000);
    }
  };

  const statusSteps = [
    { key: 'submitted', label: language === 'en' ? t.statusSubmitted : t.statusSubmittedNe, icon: '📤' },
    { key: 'under_review', label: language === 'en' ? t.statusUnderReview : t.statusUnderReviewNe, icon: '🔍' },
    { key: 'in_progress', label: language === 'en' ? t.statusInProgress : t.statusInProgressNe, icon: '⚙️' },
    { key: 'resolved', label: language === 'en' ? t.statusResolved : t.statusResolvedNe, icon: '✅' },
  ];

  const getStatusIndex = (status: string) => {
    const map: Record<string, number> = { submitted: 0, under_review: 1, in_progress: 2, resolved: 3, rejected: -1 };
    return map[status] ?? 0;
  };

  const service = complaint ? services.find(s => s.id === complaint.serviceId) || null : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Search Header */}
      <div className="bg-gradient-navy text-white px-4 pt-8 pb-10">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold mb-2">
            {language === 'en' ? t.trackTitle : t.trackTitleNe}
          </h1>
          <p className="text-blue-200 text-sm mb-6">
            {language === 'en' ? t.trackSubtitle : t.trackSubtitleNe}
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setSearched(false); }}
              placeholder={language === 'en' ? t.enterCode : t.enterCodeNe}
              className="flex-1 px-4 py-3.5 rounded-xl bg-white/10 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] min-h-[48px] text-base"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              autoFocus
            />
            <button
              onClick={handleSearch}
              className="px-5 py-3.5 bg-[#D4AF37] hover:bg-[#b8960f] rounded-xl font-bold transition-all btn-3d min-h-[48px] min-w-[48px]"
            >
              →
            </button>
          </div>
          {error && <p className="mt-3 text-red-300 text-sm animate-fadeInUp">{error}</p>}
        </div>
      </div>

      {/* Result */}
      {complaint && (
        <div className="px-4 py-6 max-w-lg mx-auto animate-fadeInUp space-y-4">
          {/* Status Badge */}
          <div className="card-mobile p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-500">{language === 'en' ? t.complaintCode : t.complaintCode}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                complaint.status === 'rejected' ? 'bg-red-100 text-red-700' :
                complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                complaint.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {complaint.status === 'submitted' ? (language === 'en' ? t.statusSubmitted : t.statusSubmittedNe) :
                 complaint.status === 'under_review' ? (language === 'en' ? t.statusUnderReview : t.statusUnderReviewNe) :
                 complaint.status === 'in_progress' ? (language === 'en' ? t.statusInProgress : t.statusInProgressNe) :
                 complaint.status === 'resolved' ? (language === 'en' ? t.statusResolved : t.statusResolvedNe) :
                 (language === 'en' ? t.statusRejected : t.statusRejectedNe)}
              </span>
            </div>
            <p className="font-mono text-lg font-bold text-[#DC143C]">{complaint.code}</p>
          </div>

          {/* Vertical Timeline - Mobile */}
          <div className="card-mobile p-4">
            <h3 className="font-bold text-[#1B3A6B] mb-4 text-sm">
              {language === 'en' ? t.complaintStatus : t.complaintStatus}
            </h3>
            {complaint.status !== 'rejected' ? (
              <div className="timeline-vertical space-y-6">
                {statusSteps.map((step, idx) => {
                  const isActive = idx === getStatusIndex(complaint.status);
                  const isCompleted = idx < getStatusIndex(complaint.status);
                  return (
                    <div key={step.key} className="relative">
                      <div className={`timeline-dot ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}></div>
                      <div className={`pl-4 ${isActive ? 'font-semibold' : isCompleted ? '' : 'opacity-50'}`}>
                        <p className="text-sm flex items-center gap-2">
                          <span>{step.icon}</span>
                          <span>{step.label}</span>
                          {isCompleted && <span className="text-green-500 text-xs">✓</span>}
                          {isActive && <span className="text-[10px] bg-[#1B3A6B] text-white px-2 py-0.5 rounded-full">Current</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-medium text-sm">❌ {language === 'en' ? t.statusRejected : t.statusRejectedNe}</p>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="card-mobile p-4 space-y-3">
            <DetailRow label={language === 'en' ? 'Service' : 'सेवा'} value={service ? t.services[service.key] : ''} />
            <DetailRow label={language === 'en' ? t.submittedOn : t.submittedOn} value={new Date(complaint.submittedAt).toLocaleDateString()} />
            <DetailRow label={language === 'en' ? t.assignedOfficer : t.assignedOfficer} value={complaint.assignedOfficer || (language === 'en' ? 'Not assigned' : 'तोकिएको छैन')} />
            <DetailRow label={language === 'en' ? t.expectedResolution : t.expectedResolution} value={complaint.expectedResolution || '-'} />
          </div>

          {/* Remarks */}
          {complaint.remarks.length > 0 && (
            <div className="card-mobile p-4">
              <h4 className="font-bold text-[#1B3A6B] text-sm mb-2">{language === 'en' ? t.remarks : t.remarks}</h4>
              <div className="space-y-2">
                {complaint.remarks.map((r, i) => (
                  <div key={i} className="text-sm bg-gray-50 rounded-lg p-2.5">• {r}</div>
                ))}
              </div>
            </div>
          )}

          {/* Final Resolution */}
          {complaint.finalResolution && (
            <div className="card-mobile p-4 border-2 border-green-200">
              <h4 className="font-bold text-green-700 text-sm mb-2">✅ {language === 'en' ? t.finalResolution : t.finalResolution}</h4>
              <p className="text-sm text-gray-700">{complaint.finalResolution}</p>
            </div>
          )}
        </div>
      )}

      {!complaint && searched && !error && (
        <div className="text-center py-16 px-4">
          <span className="text-5xl block mb-4">🔍</span>
          <p className="text-gray-500">{language === 'en' ? t.noComplaint : t.noComplaintNe}</p>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-800 text-right max-w-[60%]">{value}</span>
    </div>
  );
}
