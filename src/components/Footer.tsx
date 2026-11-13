import { ArrowUp } from 'lucide-react';
import type { ChapterId } from '../config/watchSequence';

interface FooterProps {
  onJumpToChapter?: (chapter: ChapterId) => void;
  onJumpToSection: (sectionId: string) => void;
  onOpenSalon: () => void;
}

export function Footer({ onJumpToSection, onOpenSalon }: FooterProps) {
  return (
    <footer className="border-t border-[#c89b5c]/20 bg-[#040302] px-5 py-16 sm:px-8 lg:px-14">
      <div className="mx-auto max-w-[1320px]">
        {/* Main Footer Row */}
        <div className="grid gap-10 md:grid-cols-12 lg:gap-14">
          {/* Brand & Story Column */}
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-light tracking-[0.25em] text-[#f5efe6]">
                AURELIA
              </span>
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#c89b5c] uppercase">
                India
              </span>
            </div>
            <p className="max-w-sm text-xs leading-relaxed text-[#9c8f7e]">
              AURELIA is India’s independent luxury watchmaking house, uniting ancient
              celestial astronomy, imperial jali lattice architecture, and contemporary
              high-frequency chronometry.
            </p>
            <div className="pt-2 text-xs text-[#c4b5a0]">
              <p className="font-mono text-[10px] tracking-wider text-[#e6c697] uppercase">
                Atelier Aurelia · Mumbai & Jaipur
              </p>
              <p className="mt-1 text-[#9c8f7e]">
                Private Client Salons: Mumbai · New Delhi · Bengaluru · Jaipur · Dubai · London
              </p>
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-3 md:col-span-3">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#c89b5c] uppercase">
              Navigation
            </p>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onJumpToSection('heritage')}
                  className="text-[#9c8f7e] transition-colors hover:text-[#f5efe6]"
                >
                  About AURELIA
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onJumpToSection('art-of-time')}
                  className="text-[#9c8f7e] transition-colors hover:text-[#f5efe6]"
                >
                  The Art of Time
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onJumpToSection('watch-experience')}
                  className="text-[#9c8f7e] transition-colors hover:text-[#f5efe6]"
                >
                  3D Interactive Experience
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onJumpToSection('salon-cta')}
                  className="text-[#9c8f7e] transition-colors hover:text-[#f5efe6]"
                >
                  Private Viewing Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Client Concierge Column */}
          <div className="space-y-3 md:col-span-4">
            <p className="font-mono text-[10px] tracking-[0.3em] text-[#c89b5c] uppercase">
              Private Concierge
            </p>
            <p className="text-xs text-[#9c8f7e]">
              For private acquisition inquiries, limited edition allocations, or bespoke
              consultations:
            </p>
            <div className="space-y-1 text-xs font-mono">
              <p className="text-[#e6c697]">concierge@aureliahorology.in</p>
              <p className="text-[#f5efe6]">+91 22 6900 8920</p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onOpenSalon}
                className="rounded-full border border-[#c89b5c]/40 bg-[#c89b5c]/10 px-5 py-2 font-mono text-[10px] tracking-[0.2em] text-[#e6c697] uppercase transition-all hover:border-[#e6c697] hover:bg-[#c89b5c]/25"
              >
                Schedule Private Salon
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#c89b5c]/15 pt-8 sm:flex-row">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#9c8f7e] uppercase">
            © {new Date().getFullYear()} AURELIA HOROLOGY INDIA PVT. LTD. ALL RIGHTS RESERVED.
          </p>

          <button
            type="button"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-[#e6c697] uppercase transition-colors hover:text-[#f5efe6]"
          >
            Back to Top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
