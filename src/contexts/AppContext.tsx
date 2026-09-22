import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Complaint, StaffUser, generateMockComplaints } from '../data/services';

interface AppContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  getComplaintByCode: (code: string) => Complaint | undefined;
  currentUser: StaffUser | null;
  login: (username: string, password: string, role: string) => StaffUser | null;
  logout: () => void;
  toast: { message: string; type: 'success' | 'error' | 'warning' } | null;
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const staffUsers = [
  { username: 'nayab1', password: 'pass123', name: 'Ram Bahadur Thapa', nameNe: 'राम बहादुर थापा', role: 'nayab_subba' as const, designation: 'Nayab Subba', designationNe: 'नायब सुब्बा' },
  { username: 'officer1', password: 'pass123', name: 'Sita Sharma', nameNe: 'सीता शर्मा', role: 'tax_officer' as const, designation: 'Tax Officer', designationNe: 'कर अधिकृत' },
  { username: 'chief1', password: 'pass123', name: 'Hari Prasad Pokharel', nameNe: 'हरि प्रसाद पोखरेल', role: 'chief_tax_officer' as const, designation: 'Chief Tax Officer', designationNe: 'प्रमुख कर अधिकृत' },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const stored = localStorage.getItem('iro_complaints');
    if (stored) {
      try { return JSON.parse(stored); } catch { return generateMockComplaints(); }
    }
    return generateMockComplaints();
  });

  const [currentUser, setCurrentUser] = useState<StaffUser | null>(() => {
    const stored = localStorage.getItem('iro_current_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  useEffect(() => {
    localStorage.setItem('iro_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('iro_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('iro_current_user');
    }
  }, [currentUser]);

  const addComplaint = useCallback((complaint: Complaint) => {
    setComplaints(prev => [complaint, ...prev]);
  }, []);

  const updateComplaint = useCallback((id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const getComplaintByCode = useCallback((code: string) => {
    return complaints.find(c => c.code === code);
  }, [complaints]);

  const login = useCallback((username: string, password: string, role: string) => {
    const user = staffUsers.find(u => u.username === username && u.password === password && u.role === role);
    if (user) {
      setCurrentUser(user);
      return user;
    }
    return null;
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  return (
    <AppContext.Provider value={{
      complaints, addComplaint, updateComplaint, getComplaintByCode,
      currentUser, login, logout, toast, showToast
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
