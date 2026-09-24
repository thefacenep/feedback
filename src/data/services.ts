export type ServiceKey = 
  | 'helpDesk' | 'taxClearance' | 'pdcr' | 'fileTransfer' | 'personalPan'
  | 'businessPan' | 'businessClosure' | 'businessDeregistration' | 'schemeApplication'
  | 'vatAdjustment' | 'dueClearance' | 'bankAccount' | 'taxAudit' | 'investigation'
  | 'complaint' | 'otherServices';

export interface Service {
  id: string;
  key: ServiceKey;
  icon: string;
  color: string;
}

export const services: Service[] = [
  { id: 'help-desk', key: 'helpDesk', icon: '🏢', color: 'from-blue-500 to-blue-700' },
  { id: 'tax-clearance', key: 'taxClearance', icon: '✅', color: 'from-green-500 to-green-700' },
  { id: 'pdcr', key: 'pdcr', icon: '📝', color: 'from-purple-500 to-purple-700' },
  { id: 'file-transfer', key: 'fileTransfer', icon: '📂', color: 'from-orange-500 to-orange-700' },
  { id: 'personal-pan', key: 'personalPan', icon: '🪪', color: 'from-teal-500 to-teal-700' },
  { id: 'business-pan', key: 'businessPan', icon: '🏪', color: 'from-indigo-500 to-indigo-700' },
  { id: 'business-closure', key: 'businessClosure', icon: '🔒', color: 'from-red-500 to-red-700' },
  { id: 'business-deregistration', key: 'businessDeregistration', icon: '📋', color: 'from-pink-500 to-pink-700' },
  { id: 'scheme-application', key: 'schemeApplication', icon: '📑', color: 'from-cyan-500 to-cyan-700' },
  { id: 'vat-adjustment', key: 'vatAdjustment', icon: '🧾', color: 'from-amber-500 to-amber-700' },
  { id: 'due-clearance', key: 'dueClearance', icon: '💰', color: 'from-emerald-500 to-emerald-700' },
  { id: 'bank-account', key: 'bankAccount', icon: '🏦', color: 'from-sky-500 to-sky-700' },
  { id: 'tax-audit', key: 'taxAudit', icon: '🔍', color: 'from-violet-500 to-violet-700' },
  { id: 'investigation', key: 'investigation', icon: '🔎', color: 'from-rose-500 to-rose-700' },
  { id: 'complaint', key: 'complaint', icon: '⚠️', color: 'from-yellow-500 to-yellow-700' },
  { id: 'other-services', key: 'otherServices', icon: '📌', color: 'from-slate-500 to-slate-700' },
];

export interface Complaint {
  id: string;
  code: string;
  serviceId: string;
  serviceKey: string;
  name: string;
  anonymous: boolean;
  pan: string;
  contact: string;
  email: string;
  dateOfVisit: string;
  serviceRating: number;
  staffRating: number;
  waitingRating: number;
  issueResolved: string;
  feedback: string;
  suggestion: string;
  category: string;
  status: 'submitted' | 'under_review' | 'in_progress' | 'resolved' | 'rejected';
  assignedOfficer: string;
  officerDesignation: string;
  remarks: string[];
  submittedAt: string;
  expectedResolution: string;
  finalResolution: string;
}

export interface StaffUser {
  username: string;
  password: string;
  name: string;
  nameNe: string;
  role: 'nayab_subba' | 'tax_officer' | 'chief_tax_officer';
  designation: string;
  designationNe: string;
}

export const staffUsers: StaffUser[] = [
  { username: 'nayab1', password: 'pass123', name: 'Ram Bahadur Thapa', nameNe: 'राम बहादुर थापा', role: 'nayab_subba', designation: 'Nayab Subba', designationNe: 'नायब सुब्बा' },
  { username: 'officer1', password: 'pass123', name: 'Sita Sharma', nameNe: 'सीता शर्मा', role: 'tax_officer', designation: 'Tax Officer', designationNe: 'कर अधिकृत' },
  { username: 'chief1', password: 'pass123', name: 'Hari Prasad Pokharel', nameNe: 'हरि प्रसाद पोखरेल', role: 'chief_tax_officer', designation: 'Chief Tax Officer', designationNe: 'प्रमुख कर अधिकृत' },
];

// Generate mock complaints for demo
export function generateMockComplaints(): Complaint[] {
  const statuses: Complaint['status'][] = ['submitted', 'under_review', 'in_progress', 'resolved', 'rejected'];
  const categories = ['praise', 'suggestion', 'complaint', 'grievance'];
  const officers = ['Ram Bahadur Thapa', 'Sita Sharma', 'Hari Prasad Pokharel', 'Gita Devi Maharjan', 'Bikash Adhikari'];
  const designations = ['Nayab Subba', 'Tax Officer', 'Chief Tax Officer'];
  
  const complaints: Complaint[] = [];
  
  for (let i = 0; i < 25; i++) {
    const serviceIdx = Math.floor(Math.random() * services.length);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    
    const code = `IRO-KTW-${date.toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;
    
    complaints.push({
      id: `complaint-${i}`,
      code,
      serviceId: services[serviceIdx].id,
      serviceKey: services[serviceIdx].key,
      name: ['Anonymous', 'Rajesh Karki', 'Sunita Lama', 'Bijay Shrestha', 'Anita Poudel'][Math.floor(Math.random() * 5)],
      anonymous: Math.random() > 0.7,
      pan: Math.random() > 0.5 ? `60000000${Math.floor(Math.random() * 99)}` : '',
      contact: Math.random() > 0.5 ? `98${Math.floor(Math.random() * 99999999).toString().padStart(8, '0')}` : '',
      email: '',
      dateOfVisit: date.toISOString().slice(0, 10),
      serviceRating: Math.floor(Math.random() * 3) + 3,
      staffRating: Math.floor(Math.random() * 3) + 3,
      waitingRating: Math.floor(Math.random() * 4) + 2,
      issueResolved: ['yes', 'no', 'partially'][Math.floor(Math.random() * 3)],
      feedback: 'Sample feedback text for demonstration purposes.',
      suggestion: '',
      category: categories[Math.floor(Math.random() * categories.length)],
      status,
      assignedOfficer: officers[Math.floor(Math.random() * officers.length)],
      officerDesignation: designations[Math.floor(Math.random() * designations.length)],
      remarks: ['Initial review completed.', 'Forwarded to concerned section.'],
      submittedAt: date.toISOString(),
      expectedResolution: new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      finalResolution: status === 'resolved' ? 'Issue has been resolved satisfactorily.' : ''
    });
  }
  
  return complaints;
}
