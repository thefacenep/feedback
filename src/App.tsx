import { useState } from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppProvider } from './contexts/AppContext';
import Header from './components/Header';
import HomePage from './components/HomePage';
import FeedbackForm from './components/FeedbackForm';
import ComplaintTracking from './components/ComplaintTracking';
import StaffLogin from './components/StaffLogin';
import StaffDashboard from './components/StaffDashboard';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import Toast from './components/Toast';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState<string | undefined>(undefined);

  const handleNavigate = (page: string) => {
    if (page.startsWith('track/')) {
      const code = page.split('/')[1];
      setTrackingCode(code);
      setCurrentPage('track');
    } else {
      setCurrentPage(page);
      setTrackingCode(undefined);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Scroll to sections after render
    if (page === 'services' || page === 'faq' || page === 'track' || page === 'contact') {
      setTimeout(() => {
        const el = document.getElementById(page === 'track' ? 'track' : page);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    setCurrentPage('feedback');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} onSelectService={handleSelectService} />;
      case 'services':
        return <HomePage onNavigate={handleNavigate} onSelectService={handleSelectService} />;
      case 'feedback':
        return (
          <FeedbackForm
            serviceId={selectedService}
            onClose={() => handleNavigate('home')}
            onNavigate={handleNavigate}
          />
        );
      case 'track':
        return <ComplaintTracking initialCode={trackingCode} />;
      case 'login':
        return <StaffLogin onNavigate={handleNavigate} />;
      case 'dashboard':
        return <StaffDashboard onNavigate={handleNavigate} />;
      case 'faq':
        return <HomePage onNavigate={handleNavigate} onSelectService={handleSelectService} />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={handleNavigate} onSelectService={handleSelectService} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}
