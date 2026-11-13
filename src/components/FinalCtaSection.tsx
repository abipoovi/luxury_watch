import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Calendar, Shield, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface FinalCtaSectionProps {
  onOpenSalon: () => void;
}

export function FinalCtaSection({ onOpenSalon }: FinalCtaSectionProps) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cta-reveal', {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="salon-cta"
      className="relative overflow-hidden border-t border-[#c89b5c]/20 bg-[#050402] px-5 py-28 sm:px-8 sm:py-36 lg:px-14"
    >
      {/* Background Radial Glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(200, 155, 92, 0.12) 0%, rgba(5, 4, 2, 0) 70%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="cta-reveal inline-flex items-center gap-2.5">
          <span className="h-px w-6 bg-[#c89b5c]" />
          <span className="font-mono text-[10px] tracking-[0.35em] text-[#c89b5c] uppercase">
            Private Indian Experience
          </span>
          <span className="h-px w-6 bg-[#c89b5c]" />
        </div>

        <h2 className="cta-reveal mt-5 font-serif text-4xl font-light tracking-wide text-[#f5efe6] sm:text-6xl lg:text-7xl">
          Possess the <span className="italic text-gold-gradient">Perpetual</span>
        </h2>

        <p className="cta-reveal mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#c4b5a0] sm:text-base">
          Limited to fifty individually numbered timepieces worldwide. Reserve an
          exclusive private salon viewing in Mumbai, New Delhi, Bengaluru, or Jaipur to
          experience Calibre AU-8920 in person.
        </p>

        {/* Benefits Badges */}
        <div className="cta-reveal mt-10 flex flex-wrap justify-center gap-6 text-left sm:gap-10">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c89b5c]/35 bg-[#0d0a06] text-[#e6c697]">
              <Shield className="h-4 w-4" />
            </span>
            <div>
              <p className="font-serif text-sm text-[#f5efe6]">5-Year Guarantee</p>
              <p className="font-mono text-[9px] tracking-wider text-[#9c8f7e] uppercase">
                Complimentary Servicing
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c89b5c]/35 bg-[#0d0a06] text-[#e6c697]">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <p className="font-serif text-sm text-[#f5efe6]">Bespoke Engraving</p>
              <p className="font-mono text-[9px] tracking-wider text-[#9c8f7e] uppercase">
                Royal Caseback Monogram
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#c89b5c]/35 bg-[#0d0a06] text-[#e6c697]">
              <Calendar className="h-4 w-4" />
            </span>
            <div>
              <p className="font-serif text-sm text-[#f5efe6]">Private Presentation</p>
              <p className="font-mono text-[9px] tracking-wider text-[#9c8f7e] uppercase">
                Head Horologist Concierge
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="cta-reveal mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={onOpenSalon}
            className="inline-flex items-center gap-2.5 rounded-full border border-[#e6c697] bg-gradient-to-r from-[#c89b5c] to-[#e6c697] px-8 py-4 font-mono text-[11px] tracking-[0.25em] text-[#050402] font-semibold uppercase shadow-[0_0_30px_rgba(200,155,92,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(200,155,92,0.5)]"
          >
            Reserve Private Consultation
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
