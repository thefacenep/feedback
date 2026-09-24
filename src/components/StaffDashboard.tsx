import { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { services, Complaint } from '../data/services';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface StaffDashboardProps {
  onNavigate: (page: string) => void;
}

export default function StaffDashboard({ onNavigate }: StaffDashboardProps) {
  const { t, language } = useLanguage();
  const { complaints, currentUser, updateComplaint } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'complaints' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [remarkInput, setRemarkInput] = useState('');

  if (!currentUser) return null;

  const filteredComplaints = useMemo(() => {
    let filtered = [...complaints];
    if (searchQuery) {
      filtered = filtered.filter(c => c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (statusFilter !== 'all') filtered = filtered.filter(c => c.status === statusFilter);
    if (serviceFilter !== 'all') filtered = filtered.filter(c => c.serviceId === serviceFilter);
    return filtered;
  }, [complaints, searchQuery, statusFilter, serviceFilter]);

  const todayCount = complaints.filter(c => c.submittedAt.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const pendingCount = complaints.filter(c => c.status !== 'resolved' && c.status !== 'rejected').length;
  const avgSatisfaction = complaints.length > 0 ? (complaints.reduce((a, c) => a + (c.serviceRating || 0), 0) / complaints.length).toFixed(1) : '0.0';

  const serviceDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach(c => {
      const svc = services.find(s => s.id === c.serviceId);
      if (svc) { const name = t.services[svc.key] || svc.key; counts[name] = (counts[name] || 0) + 1; }
    });
    const result = Object.entries(counts).map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, value })).slice(0, 8);
    return result.length > 0 ? result : [{ name: 'No data', value: 1 }];
  }, [complaints, t]);

  const trendData = useMemo(() => {
    const days: { date: string; complaints: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(); date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      days.push({ date: date.toLocaleDateString('en-US', { weekday: 'short' }), complaints: complaints.filter(c => c.submittedAt.slice(0, 10) === dateStr).length });
    }
    return days;
  }, [complaints]);

  const COLORS = ['#1B3A6B', '#DC143C', '#D4AF37', '#2a5298', '#a01030', '#b8960f', '#4a90d9', '#e74c3c'];

  const handleUpdateStatus = (id: string, status: Complaint['status']) => {
    updateComplaint(id, { status });
    setSelectedComplaint(null);
  };

  const handleAddRemark = (id: string) => {
    if (!remarkInput.trim()) return;
    const c = complaints.find(x => x.id === id);
    if (c) {
      updateComplaint(id, { remarks: [...c.remarks, remarkInput], assignedOfficer: c.assignedOfficer || currentUser.name, officerDesignation: c.officerDesignation || currentUser.designation });
      setRemarkInput('');
    }
  };

  const handleExport = () => {
    const data = filteredComplaints.map(c => ({ Code: c.code, Service: c.serviceKey, Status: c.status, Rating: c.serviceRating, Date: c.submittedAt.slice(0, 10) }));
    const csv = [Object.keys(data[0] || {}).join(','), ...data.map(r => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `IRO-Report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 desktop-only">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#1B3A6B]">{t.dashboard}</h1>
              <p className="text-sm text-gray-500">{language === 'en' ? `Welcome, ${currentUser.name}` : `स्वागत छ, ${currentUser.nameNe}`}</p>
            </div>
            <button onClick={() => { onNavigate('home'); }} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">{t.logout}</button>
          </div>
          <div className="flex gap-1 mt-4">
            {(['overview', 'complaints', 'analytics'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-t-lg text-sm font-medium ${activeTab === tab ? 'bg-[#1B3A6B] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                {tab === 'overview' ? (language === 'en' ? 'Overview' : 'सारांश') : tab === 'complaints' ? t.complaintsList : t.analytics}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <DashCard icon="📊" label={t.totalComplaints} value={complaints.length} sub={`${t.todayComplaints}: ${todayCount}`} />
              <DashCard icon="✅" label={t.resolvedComplaints} value={resolvedCount} sub="" />
              <DashCard icon="⏳" label={t.pendingComplaints} value={pendingCount} sub="" />
              <DashCard icon="⭐" label={t.avgSatisfaction} value={avgSatisfaction} sub="/ 5.0" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.serviceDistribution}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={serviceDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={(e: Record<string, unknown>) => `${String(e.name || '').slice(0, 10)}`}>
                      {serviceDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.trendAnalysis}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip />
                    <Line type="monotone" dataKey="complaints" stroke="#1B3A6B" strokeWidth={2} dot={{ fill: '#DC143C' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-5">
              <h3 className="font-bold text-[#1B3A6B] mb-4">{t.pendingVsResolved}</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden flex">
                    <div className="bg-green-500 h-full" style={{ width: `${complaints.length > 0 ? (resolvedCount / complaints.length) * 100 : 0}%` }}></div>
                    <div className="bg-yellow-500 h-full" style={{ width: `${complaints.length > 0 ? (pendingCount / complaints.length) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-[#1B3A6B]">{complaints.length > 0 ? Math.round((resolvedCount / complaints.length) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4 flex gap-3 flex-wrap">
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t.searchComplaints} className="flex-1 min-w-[200px] px-3 py-2 border rounded-lg" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
                <option value="all">{t.all}</option>
                <option value="submitted">{t.statusSubmitted}</option>
                <option value="under_review">{t.statusUnderReview}</option>
                <option value="in_progress">{t.statusInProgress}</option>
                <option value="resolved">{t.statusResolved}</option>
                <option value="rejected">{t.statusRejected}</option>
              </select>
              <select value={serviceFilter} onChange={e => setServiceFilter(e.target.value)} className="px-3 py-2 border rounded-lg">
                <option value="all">{t.filterByService}</option>
                {services.map(s => <option key={s.id} value={s.id}>{t.services[s.key]}</option>)}
              </select>
              <button onClick={handleExport} className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-medium">{t.exportReport} 📥</button>
            </div>
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Service' : 'सेवा'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Status' : 'स्थिति'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Rating' : 'रेटिङ'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Date' : 'मिति'}</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Action' : 'कार्य'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredComplaints.slice(0, 50).map(c => {
                    const svc = services.find(s => s.id === c.serviceId);
                    return (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-mono text-[#1B3A6B]">{c.code}</td>
                        <td className="px-4 py-3 text-sm">{svc ? t.services[svc.key] : ''}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'resolved' ? 'bg-green-100 text-green-700' : c.status === 'rejected' ? 'bg-red-100 text-red-700' : c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : c.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>
                            {c.status === 'submitted' ? t.statusSubmitted : c.status === 'under_review' ? t.statusUnderReview : c.status === 'in_progress' ? t.statusInProgress : c.status === 'resolved' ? t.statusResolved : t.statusRejected}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">⭐ {c.serviceRating}/5</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{c.submittedAt.slice(0, 10)}</td>
                        <td className="px-4 py-3"><button onClick={() => setSelectedComplaint(c)} className="text-[#1B3A6B] hover:text-[#DC143C] text-sm font-medium">View</button></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.satisfactionPerService}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceDistribution}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" angle={-45} textAnchor="end" height={80} /><YAxis /><Tooltip />
                    <Bar dataKey="value" fill="#1B3A6B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white rounded-xl shadow p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.topComplained}</h3>
                <div className="space-y-3">
                  {serviceDistribution.sort((a, b) => b.value - a.value).slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1"><span className="font-medium">{item.name}</span><span className="text-gray-500">{item.value}</span></div>
                        <div className="h-2 bg-gray-200 rounded-full"><div className="h-full bg-[#DC143C] rounded-full" style={{ width: `${(item.value / (serviceDistribution[0]?.value || 1)) * 100}%` }}></div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedComplaint(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#1B3A6B] to-[#2a5298] p-5 text-white rounded-t-2xl flex justify-between items-start">
              <div><h3 className="font-bold">{selectedComplaint.code}</h3><p className="text-blue-200 text-sm">{services.find(s => s.id === selectedComplaint.serviceId) ? t.services[services.find(s => s.id === selectedComplaint.serviceId)!.key] : ''}</p></div>
              <button onClick={() => setSelectedComplaint(null)} className="p-1 hover:bg-white/10 rounded"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">{t.submittedOn}:</span> <span className="font-medium">{selectedComplaint.submittedAt.slice(0, 10)}</span></div>
                <div><span className="text-gray-500">{t.category}:</span> <span className="font-medium capitalize">{selectedComplaint.category}</span></div>
                <div><span className="text-gray-500">Rating:</span> <span className="font-medium">{'⭐'.repeat(selectedComplaint.serviceRating)}</span></div>
                <div><span className="text-gray-500">{t.issueResolved}:</span> <span className="font-medium capitalize">{selectedComplaint.issueResolved}</span></div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-xs text-gray-500 mb-1">{t.detailedFeedback}</p><p className="text-sm">{selectedComplaint.feedback}</p></div>
              <div>
                <p className="text-sm font-medium mb-2">{t.remarks}</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">{selectedComplaint.remarks.map((r, i) => <div key={i} className="text-sm bg-gray-50 rounded p-2">• {r}</div>)}</div>
              </div>
              <div className="flex gap-2">
                <input type="text" value={remarkInput} onChange={e => setRemarkInput(e.target.value)} placeholder={t.remarksPlaceholder} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <button onClick={() => handleAddRemark(selectedComplaint.id)} className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm">{t.save}</button>
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t">
                {selectedComplaint.status === 'submitted' && <button onClick={() => handleUpdateStatus(selectedComplaint.id, 'under_review')} className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs">→ {t.statusUnderReview}</button>}
                {selectedComplaint.status === 'under_review' && <button onClick={() => handleUpdateStatus(selectedComplaint.id, 'in_progress')} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs">→ {t.statusInProgress}</button>}
                {selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'rejected' && <>
                  <button onClick={() => handleUpdateStatus(selectedComplaint.id, 'resolved')} className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs">✓ {t.resolve}</button>
                  <button onClick={() => handleUpdateStatus(selectedComplaint.id, 'rejected')} className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs">✗ {t.reject}</button>
                </>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DashCard({ icon, label, value, sub }: { icon: string; label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl">{icon}</div>
      <div><p className="text-2xl font-bold text-gray-800">{value}</p><p className="text-xs text-gray-500">{label} {sub}</p></div>
    </div>
  );
}
