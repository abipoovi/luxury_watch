import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onJumpToSection: (sectionId: string) => void;
  onOpenSalon: () => void;
}

export function Navbar({ onJumpToSection, onOpenSalon }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const updateProgressBar = () => {
      rafId = null;
      if (!progressBarRef.current) return;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const ratio = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      progressBarRef.current.style.transform = `scaleX(${ratio})`;
    };

    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(updateProgressBar);
      }
    };

    updateProgressBar();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onJumpToSection(sectionId);
  };

  const navLinks = [
    { id: 'heritage', label: 'About AURELIA' },
    { id: 'art-of-time', label: 'The Art of Time' },
    { id: 'watch-experience', label: '3D Sequence' },
    { id: 'salon-cta', label: 'Contact' },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[#c89b5c]/15 bg-[#050402]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-12">
        {/* Brand Signature */}
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group flex items-baseline gap-2.5 text-left focus:outline-none"
        >
          <span className="font-serif text-lg font-medium tracking-[0.28em] text-[#f5efe6] transition-colors group-hover:text-[#e6c697] sm:text-xl">
            AURELIA
          </span>
          <span className="hidden font-mono text-[9px] tracking-[0.35em] text-[#c89b5c]/85 uppercase sm:inline">
            India
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Primary site navigation"
          className="hidden items-center gap-6 md:flex lg:gap-8"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="group relative py-1 text-xs tracking-[0.2em] text-[#9c8f7e] uppercase transition-colors hover:text-[#f5efe6]"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-px bg-[#c89b5c] transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
            </button>
          ))}
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenSalon}
            className="hidden rounded-full border border-[#c89b5c]/40 bg-[#c89b5c]/10 px-4 py-1.5 font-mono text-[10px] tracking-[0.22em] text-[#e6c697] uppercase transition-all hover:border-[#e6c697] hover:bg-[#c89b5c]/25 sm:inline-flex"
          >
            Private Salon
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#c89b5c]/25 text-[#e6c697] transition-colors hover:border-[#c89b5c]/60 md:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Golden Hairline Progress Bar */}
      <div className="h-[1.5px] w-full overflow-hidden bg-[#c89b5c]/10">
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-gradient-to-r from-[#856235] via-[#c89b5c] to-[#f0d7b0]"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#c89b5c]/15 bg-[#070503]/95 px-6 py-5 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="flex items-center justify-between border-b border-[#c89b5c]/10 py-2.5 text-left"
              >
                <span className="font-serif text-lg tracking-wider text-[#f5efe6]">
                  {link.label}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSalon();
              }}
              className="mt-2 w-full rounded-full border border-[#c89b5c]/45 bg-[#c89b5c]/15 py-2.5 font-mono text-[11px] tracking-[0.24em] text-[#e6c697] uppercase"
            >
              Reserve Private Salon
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
