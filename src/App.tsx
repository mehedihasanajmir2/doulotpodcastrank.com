import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import TrustSection from './components/TrustSection';
import AboutSection from './components/AboutSection';
import StatsSection from './components/StatsSection';
import TeamSection from './components/TeamSection';
import PodcastSection from './components/PodcastSection';
import CategorySection from './components/CategorySection';
import PricingSection from './components/PricingSection';
import ProcessSection from './components/ProcessSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import ConsultationModal from './components/ConsultationModal';
import AudioPlayerWidget from './components/AudioPlayerWidget';
import AdminLoginModal from './components/AdminLoginModal';
import AdminPanel from './components/AdminPanel';
import { WebsiteProvider, useWebsiteData } from './context/WebsiteContext';
import { PodcastEpisode } from './data';

function AppContent() {
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [consultationPlanName, setConsultationPlanName] = useState('');
  const { isAdminLoggedIn } = useWebsiteData();

  const handleOpenConsultation = (planName: string = '') => {
    setConsultationPlanName(planName);
    setIsConsultationOpen(true);
  };

  const handleCloseConsultation = () => {
    setIsConsultationOpen(false);
    setConsultationPlanName('');
  };

  const handlePlayEpisode = (episode: PodcastEpisode) => {
    setSelectedEpisode(episode);
  };

  const handleClosePlayer = () => {
    setSelectedEpisode(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between" id="app-root-layout">
      {/* Dynamic Floating Components */}
      <Header onOpenConsultation={() => handleOpenConsultation()} />
      
      {/* Main Landing Flow */}
      <main className="flex-grow">
        <Hero onOpenConsultation={() => handleOpenConsultation()} />
        <TrustSection />
        <AboutSection onOpenConsultation={() => handleOpenConsultation()} />
        <StatsSection />
        <TeamSection onOpenConsultation={() => handleOpenConsultation()} />
        <PodcastSection
          onPlayEpisode={handlePlayEpisode}
          onOpenConsultation={() => handleOpenConsultation()}
        />
        <CategorySection />
        <PricingSection
          onSelectPlan={(planName) => handleOpenConsultation(planName)}
          onOpenConsultation={() => handleOpenConsultation()}
        />
        <ProcessSection />
        <TestimonialsSection />
      </main>

      {/* Footer block */}
      <Footer onOpenConsultation={() => handleOpenConsultation()} />

      {/* Floating Interactive Widget Triggers */}
      <AudioPlayerWidget episode={selectedEpisode} onClose={handleClosePlayer} />
      
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={handleCloseConsultation}
        selectedPlanName={consultationPlanName}
      />

      {/* Secret Admin Panels */}
      <AdminLoginModal />
      {isAdminLoggedIn && <AdminPanel />}
    </div>
  );
}

export default function App() {
  return (
    <WebsiteProvider>
      <AppContent />
    </WebsiteProvider>
  );
}

