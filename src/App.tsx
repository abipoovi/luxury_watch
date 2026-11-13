import { useCallback, useRef, useState } from 'react';
import { type ChapterId } from './config/watchSequence';
import { useWatchFrames } from './hooks/useWatchFrames';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import {
  WatchExperience,
  type WatchExperienceHandle,
} from './components/WatchExperience';
import { HeritageSection } from './components/HeritageSection';
import { ArtOfTimeSection } from './components/ArtOfTimeSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { PrivateSalonModal } from './components/PrivateSalonModal';
import { Footer } from './components/Footer';

export function App() {
  const framesState = useWatchFrames();
  const experienceRef = useRef<WatchExperienceHandle>(null);

  const [, setActiveSection] = useState<ChapterId>('hero');
  const [salonOpen, setSalonOpen] = useState(false);

  const handleJumpToChapter = useCallback((chapter: ChapterId) => {
    experienceRef.current?.jumpToChapter(chapter);
  }, []);

  const handleJumpToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#050402] text-[#f5efe6]">
      <Preloader
        isReady={framesState.isBootReady}
        progress={framesState.bootProgress}
      />

      <Navbar
        onJumpToSection={handleJumpToSection}
        onOpenSalon={() => setSalonOpen(true)}
      />

      <main>
        {/* Section 1: Hero & 3D Interactive Watch Experience (Pinned GSAP ScrollTrigger) */}
        <WatchExperience
          ref={experienceRef}
          framesState={framesState}
          onSectionChange={setActiveSection}
          onExploreAbout={() => handleJumpToSection('heritage')}
        />

        {/* Section 2: About AURELIA (Our Heritage & Indian Horology Provenance) */}
        <HeritageSection
          onExploreHorology={() => handleJumpToChapter('rotation')}
        />

        {/* Section 3: THE ART OF TIME (Philosophy & Masterpiece Visual) */}
        <ArtOfTimeSection />

        {/* Section 4: Contact & Private Salon Experience */}
        <FinalCtaSection onOpenSalon={() => setSalonOpen(true)} />
      </main>

      <Footer
        onJumpToChapter={handleJumpToChapter}
        onJumpToSection={handleJumpToSection}
        onOpenSalon={() => setSalonOpen(true)}
      />

      <PrivateSalonModal
        isOpen={salonOpen}
        onClose={() => setSalonOpen(false)}
      />
    </div>
  );
}

export default App;
