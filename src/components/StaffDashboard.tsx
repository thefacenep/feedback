import { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useApp } from '../contexts/AppContext';
import { services, Complaint } from '../data/services';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';

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

  const isChief = currentUser.role === 'chief_tax_officer';
  const isOfficer = currentUser.role === 'tax_officer' || isChief;

  // Filter complaints based on role
  const filteredComplaints = useMemo(() => {
    let filtered = [...complaints];
    
    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.feedback.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(c => c.serviceId === serviceFilter);
    }
    return filtered;
  }, [complaints, searchQuery, statusFilter, serviceFilter]);

  // Stats
  const todayCount = complaints.filter(c => {
    const today = new Date().toISOString().slice(0, 10);
    return c.submittedAt.slice(0, 10) === today;
  }).length;

  const weekCount = complaints.filter(c => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return new Date(c.submittedAt) >= weekAgo;
  }).length;

  const monthCount = complaints.filter(c => {
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(c.submittedAt) >= monthAgo;
  }).length;

  const resolvedCount = complaints.filter(c => c.status === 'resolved').length;
  const pendingCount = complaints.filter(c => c.status !== 'resolved' && c.status !== 'rejected').length;
  const avgSatisfaction = complaints.length > 0
    ? (complaints.reduce((a, c) => a + c.serviceRating, 0) / complaints.length).toFixed(1)
    : '0';

  // Chart data
  const serviceDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach(c => {
      const svc = services.find(s => s.id === c.serviceId);
      if (svc) {
        const name = t.services[svc.key];
        counts[name] = (counts[name] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name: name.length > 15 ? name.slice(0, 15) + '...' : name, value })).slice(0, 8);
  }, [complaints, t]);

  const trendData = useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().slice(0, 10);
      const count = complaints.filter(c => c.submittedAt.slice(0, 10) === dateStr).length;
      last7Days.push({
        date: date.toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', { weekday: 'short' }),
        complaints: count
      });
    }
    return last7Days;
  }, [complaints, language]);

  const satisfactionData = useMemo(() => {
    const svcRatings: Record<string, { total: number; count: number }> = {};
    complaints.forEach(c => {
      const svc = services.find(s => s.id === c.serviceId);
      if (svc) {
        const key = t.services[svc.key];
        if (!svcRatings[key]) svcRatings[key] = { total: 0, count: 0 };
        svcRatings[key].total += c.serviceRating;
        svcRatings[key].count += 1;
      }
    });
    return Object.entries(svcRatings)
      .map(([name, data]) => ({ name: name.length > 12 ? name.slice(0, 12) + '...' : name, avg: +(data.total / data.count).toFixed(1) }))
      .slice(0, 8);
  }, [complaints, t]);

  const COLORS = ['#1B3A6B', '#DC143C', '#D4AF37', '#2a5298', '#a01030', '#b8960f', '#4a90d9', '#e74c3c'];

  const handleUpdateStatus = (complaintId: string, newStatus: Complaint['status']) => {
    updateComplaint(complaintId, { status: newStatus });
    setSelectedComplaint(null);
  };

  const handleAddRemark = (complaintId: string) => {
    if (!remarkInput.trim()) return;
    const complaint = complaints.find(c => c.id === complaintId);
    if (complaint) {
      updateComplaint(complaintId, {
        remarks: [...complaint.remarks, remarkInput],
        assignedOfficer: complaint.assignedOfficer || currentUser.name,
        officerDesignation: complaint.officerDesignation || currentUser.designation
      });
      setRemarkInput('');
    }
  };

  const handleExport = (type: 'daily' | 'weekly' | 'monthly') => {
    const data = filteredComplaints.map(c => ({
      Code: c.code,
      Service: c.serviceKey,
      Status: c.status,
      Rating: c.serviceRating,
      Date: c.submittedAt.slice(0, 10),
      Category: c.category
    }));
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IRO-Koteshwor-Report-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-[#1B3A6B]">{t.dashboard}</h1>
              <p className="text-sm text-gray-500">
                {language === 'en' ? `Welcome, ${currentUser.name}` : `स्वागत छ, ${currentUser.nameNe}`} — {currentUser.designation}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                isChief ? 'bg-[#D4AF37] text-white' : isOfficer ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {isChief ? t.chiefTaxOfficer : isOfficer ? t.taxOfficer : t.nayabSubba}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            {[
              { key: 'overview', label: language === 'en' ? 'Overview' : 'सारांश' },
              { key: 'complaints', label: t.complaintsList },
              { key: 'analytics', label: t.analytics },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#1B3A6B] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeInUp">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon="📊" label={t.totalComplaints} value={complaints.length} sub={`${t.todayComplaints}: ${todayCount}`} color="bg-blue-50 text-blue-700" />
              <StatCard icon="✅" label={t.resolvedComplaints} value={resolvedCount} sub={`${t.weekComplaints}: ${weekCount}`} color="bg-green-50 text-green-700" />
              <StatCard icon="⏳" label={t.pendingComplaints} value={pendingCount} sub={`${t.monthComplaints}: ${monthCount}`} color="bg-yellow-50 text-yellow-700" />
              <StatCard icon="⭐" label={t.avgSatisfaction} value={avgSatisfaction} sub="/ 5.0" color="bg-purple-50 text-purple-700" />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.serviceDistribution}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={serviceDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={false}>
                      {serviceDistribution.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.trendAnalysis}</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="complaints" stroke="#1B3A6B" strokeWidth={2} dot={{ fill: '#DC143C' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pending vs Resolved */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-[#1B3A6B] mb-4">{t.pendingVsResolved}</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-green-600 font-medium">{t.resolvedComplaints}: {resolvedCount}</span>
                    <span className="text-yellow-600 font-medium">{t.pendingComplaints}: {pendingCount}</span>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full overflow-hidden flex">
                    <div className="bg-green-500 h-full transition-all duration-500" style={{ width: `${(resolvedCount / complaints.length) * 100}%` }}></div>
                    <div className="bg-yellow-500 h-full transition-all duration-500" style={{ width: `${(pendingCount / complaints.length) * 100}%` }}></div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-[#1B3A6B]">
                  {complaints.length > 0 ? Math.round((resolvedCount / complaints.length) * 100) : 0}%
                </div>
              </div>
            </div>

            {/* SLA Tracking */}
            {isChief && (
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.slaTracking}</h3>
                <div className="space-y-2">
                  {complaints.filter(c => {
                    if (c.status === 'resolved' || c.status === 'rejected') return false;
                    const daysSince = Math.floor((Date.now() - new Date(c.submittedAt).getTime()) / (24 * 60 * 60 * 1000));
                    return daysSince > 7;
                  }).slice(0, 5).map(c => {
                    const daysSince = Math.floor((Date.now() - new Date(c.submittedAt).getTime()) / (24 * 60 * 60 * 1000));
                    const slaLevel = daysSince > 30 ? 'critical' : daysSince > 15 ? 'warning' : 'alert';
                    return (
                      <div key={c.id} className={`flex items-center justify-between p-3 rounded-lg ${
                        slaLevel === 'critical' ? 'bg-red-50 border border-red-200' :
                        slaLevel === 'warning' ? 'bg-orange-50 border border-orange-200' :
                        'bg-yellow-50 border border-yellow-200'
                      }`}>
                        <div>
                          <span className="font-mono text-sm font-medium">{c.code}</span>
                          <span className="text-xs text-gray-500 ml-2">{t.services[services.find(s => s.id === c.serviceId)?.key || 'helpDesk']}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                          slaLevel === 'critical' ? 'bg-red-200 text-red-800' :
                          slaLevel === 'warning' ? 'bg-orange-200 text-orange-800' :
                          'bg-yellow-200 text-yellow-800'
                        }`}>
                          {daysSince} {language === 'en' ? 'days' : 'दिन'}
                        </span>
                      </div>
                    );
                  })}
                  {complaints.filter(c => c.status !== 'resolved' && c.status !== 'rejected' && Math.floor((Date.now() - new Date(c.submittedAt).getTime()) / (24 * 60 * 60 * 1000)) > 7).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">{language === 'en' ? 'No SLA violations' : 'कुनै SLA उल्लंघन छैन'}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'complaints' && (
          <div className="space-y-4 animate-fadeInUp">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchComplaints}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B] focus:border-transparent"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B]"
                >
                  <option value="all">{t.all}</option>
                  <option value="submitted">{t.statusSubmitted}</option>
                  <option value="under_review">{t.statusUnderReview}</option>
                  <option value="in_progress">{t.statusInProgress}</option>
                  <option value="resolved">{t.statusResolved}</option>
                  <option value="rejected">{t.statusRejected}</option>
                </select>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1B3A6B]"
                >
                  <option value="all">{t.filterByService}</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{t.services[s.key]}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Complaints Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t.complaintCode}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Service' : 'सेवा'}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Status' : 'स्थिति'}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Rating' : 'मूल्याङ्कन'}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Date' : 'मिति'}</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{language === 'en' ? 'Action' : 'कार्य'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredComplaints.slice(0, 20).map(c => {
                      const svc = services.find(s => s.id === c.serviceId);
                      return (
                        <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-mono font-medium text-[#1B3A6B]">{c.code}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{svc ? t.services[svc.key] : c.serviceKey}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.status === 'resolved' ? 'bg-green-100 text-green-700' :
                              c.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              c.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                              c.status === 'under_review' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {c.status === 'submitted' ? t.statusSubmitted :
                               c.status === 'under_review' ? t.statusUnderReview :
                               c.status === 'in_progress' ? t.statusInProgress :
                               c.status === 'resolved' ? t.statusResolved : t.statusRejected}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">⭐ {c.serviceRating}/5</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{c.submittedAt.slice(0, 10)}</td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedComplaint(c)}
                              className="text-[#1B3A6B] hover:text-[#DC143C] text-sm font-medium transition-colors"
                            >
                              {language === 'en' ? 'View' : 'हेर्नुहोस्'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredComplaints.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {language === 'en' ? 'No complaints found' : 'कुनै उजुरी भेटिएन'}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeInUp">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.satisfactionPerService}</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={satisfactionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 5]} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <Tooltip />
                    <Bar dataKey="avg" fill="#1B3A6B" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.topComplained}</h3>
                <div className="space-y-3">
                  {serviceDistribution.sort((a, b) => b.value - a.value).slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">{item.name}</span>
                          <span className="text-gray-500">{item.value}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#DC143C] rounded-full" style={{ width: `${(item.value / serviceDistribution[0].value) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Staff Performance */}
            {isChief && (
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.staffPerformance}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: language === 'en' ? 'Ram Bahadur Thapa' : 'राम बहादुर थापा', role: t.nayabSubba, resolved: 12, pending: 3 },
                    { name: language === 'en' ? 'Sita Sharma' : 'सीता शर्मा', role: t.taxOfficer, resolved: 18, pending: 5 },
                    { name: language === 'en' ? 'Hari Prasad Pokharel' : 'हरि प्रसाद पोखरेल', role: t.chiefTaxOfficer, resolved: 25, pending: 2 },
                  ].map((staff, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-[#1B3A6B] text-white flex items-center justify-center text-sm font-bold">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{staff.name}</p>
                          <p className="text-xs text-gray-500">{staff.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-4 mt-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{staff.resolved}</p>
                          <p className="text-[10px] text-gray-500">{t.resolvedComplaints}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-yellow-600">{staff.pending}</p>
                          <p className="text-[10px] text-gray-500">{t.pendingComplaints}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export */}
            {isChief && (
              <div className="bg-white rounded-xl shadow-md p-5">
                <h3 className="font-bold text-[#1B3A6B] mb-4">{t.exportReport}</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => handleExport('daily')} className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-medium hover:bg-[#0f2347] transition-all">
                    📄 {t.dailyReport} CSV
                  </button>
                  <button onClick={() => handleExport('weekly')} className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-medium hover:bg-[#0f2347] transition-all">
                    📊 {t.weeklyReport} CSV
                  </button>
                  <button onClick={() => handleExport('monthly')} className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-medium hover:bg-[#0f2347] transition-all">
                    📈 {t.monthlyReport} CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedComplaint(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#1B3A6B] to-[#2a5298] p-5 text-white rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{selectedComplaint.code}</h3>
                  <p className="text-blue-200 text-sm">{services.find(s => s.id === selectedComplaint.serviceId) ? t.services[services.find(s => s.id === selectedComplaint.serviceId)!.key] : selectedComplaint.serviceKey}</p>
                </div>
                <button onClick={() => setSelectedComplaint(null)} className="p-1 hover:bg-white/10 rounded">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">{t.submittedOn}:</span> <span className="font-medium">{selectedComplaint.submittedAt.slice(0, 10)}</span></div>
                <div><span className="text-gray-500">{t.category}:</span> <span className="font-medium capitalize">{selectedComplaint.category}</span></div>
                <div><span className="text-gray-500">{t.serviceExperience}:</span> <span className="font-medium">{'⭐'.repeat(selectedComplaint.serviceRating)}</span></div>
                <div><span className="text-gray-500">{t.issueResolved}:</span> <span className="font-medium capitalize">{selectedComplaint.issueResolved}</span></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">{t.detailedFeedback}</p>
                <p className="text-sm text-gray-700">{selectedComplaint.feedback}</p>
              </div>

              {/* Remarks */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{t.remarks}</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {selectedComplaint.remarks.map((r, i) => (
                    <div key={i} className="text-sm bg-gray-50 rounded p-2">• {r}</div>
                  ))}
                </div>
              </div>

              {/* Add Remark */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={remarkInput}
                  onChange={(e) => setRemarkInput(e.target.value)}
                  placeholder={t.remarksPlaceholder}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1B3A6B]"
                />
                <button
                  onClick={() => handleAddRemark(selectedComplaint.id)}
                  className="px-4 py-2 bg-[#1B3A6B] text-white rounded-lg text-sm font-medium hover:bg-[#0f2347]"
                >
                  {t.save}
                </button>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-3 border-t">
                {selectedComplaint.status === 'submitted' && (
                  <button onClick={() => handleUpdateStatus(selectedComplaint.id, 'under_review')} className="px-3 py-2 bg-yellow-500 text-white rounded-lg text-xs font-medium hover:bg-yellow-600">
                    → {t.statusUnderReview}
                  </button>
                )}
                {(selectedComplaint.status === 'under_review' && isOfficer) && (
                  <button onClick={() => handleUpdateStatus(selectedComplaint.id, 'in_progress')} className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600">
                    → {t.statusInProgress}
                  </button>
                )}
                {selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'rejected' && (
                  <>
                    <button onClick={() => handleUpdateStatus(selectedComplaint.id, 'resolved')} className="px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600">
                      ✓ {t.resolve}
                    </button>
                    {isChief && (
                      <button onClick={() => handleUpdateStatus(selectedComplaint.id, 'rejected')} className="px-3 py-2 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600">
                        ✗ {t.reject}
                      </button>
                    )}
                  </>
                )}
                {isOfficer && selectedComplaint.status !== 'resolved' && (
                  <button onClick={() => {
                    updateComplaint(selectedComplaint.id, {
                      assignedOfficer: currentUser.name,
                      officerDesignation: currentUser.designation
                    });
                  }} className="px-3 py-2 bg-purple-500 text-white rounded-lg text-xs font-medium hover:bg-purple-600">
                    👤 {t.assignOfficer}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string | number; sub: string; color: string }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-[10px] text-gray-400">{sub}</p>
        </div>
      </div>
    </div>
  );
}
