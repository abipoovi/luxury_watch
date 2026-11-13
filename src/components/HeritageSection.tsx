import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Feather, ShieldCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface HeritageSectionProps {
  onExploreHorology: () => void;
}

export function HeritageSection({ onExploreHorology }: HeritageSectionProps) {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.heritage-fade', {
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

      gsap.from('.heritage-image-card', {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.heritage-image-card',
          start: 'top 80%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="heritage"
      className="relative border-t border-[#c89b5c]/20 bg-gradient-to-b from-[#050402] via-[#090704] to-[#050402] px-5 py-24 sm:px-8 sm:py-32 lg:px-14"
    >
      <div className="mx-auto max-w-[1320px]">
        {/* Editorial Subheader */}
        <div className="heritage-fade max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2.5">
            <span className="h-px w-6 bg-[#c89b5c]" />
            <span className="font-mono text-[10px] tracking-[0.35em] text-[#c89b5c] uppercase">
              Our Heritage & Provenance
            </span>
          </div>
          <h2 className="font-serif text-3xl font-light tracking-wide text-[#f5efe6] sm:text-5xl lg:text-6xl">
            A Legacy of Royal Precision,{' '}
            <span className="block italic text-gold-gradient">Reimagined for Today</span>
          </h2>
        </div>

        {/* Dynamic Split Layout */}
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left: High-Resolution Heritage Visual */}
          <div className="heritage-image-card relative overflow-hidden rounded-3xl border border-[#c89b5c]/25 bg-[#0a0805] p-2.5 shadow-2xl lg:col-span-7">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
              <img
                src="/indian_luxury/heritage-jaipur.jpg"
                alt="AURELIA Indian Heritage Watchmaking Craftsmanship"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050402] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#e6c697] uppercase">
                    Jaipur Royal Astronomers & Horology
                  </span>
                  <p className="font-serif text-lg text-[#f5efe6] sm:text-xl">
                    Chiaroscuro Gold Dial & Jali Skeleton
                  </p>
                </div>
                <span className="hidden font-mono text-[10px] tracking-[0.2em] text-[#9c8f7e] sm:inline-block">
                  Atelier Aurelia · India
                </span>
              </div>
            </div>
          </div>

          {/* Right: Narrative Content */}
          <div className="heritage-fade space-y-6 lg:col-span-5">
            <p className="text-base leading-relaxed text-[#c4b5a0] sm:text-lg">
              India has observed the celestial rhythms of time for millennia—from the stone
              dials of Jantar Mantar to the intricate gold filigree of royal courts.
              AURELIA represents the dawn of contemporary Indian haute horlogerie.
            </p>
            <p className="text-sm leading-relaxed text-[#9c8f7e]">
              We merge centuries of indigenous metalcraft, architectural lattice
              principles, and precision hand-finishing with 28,800 vph high-frequency
              chronometric movements. Each timepiece is hand-regulated and assembled in
              our private atelier.
            </p>

            {/* Badges Grid */}
            <div className="grid gap-4 pt-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#c89b5c]/15 bg-[#0b0805] p-4">
                <ShieldCheck className="h-5 w-5 text-[#c89b5c]" />
                <h4 className="mt-2.5 font-serif text-lg text-[#f5efe6]">Sovereign Hallmark</h4>
                <p className="mt-1 text-xs text-[#9c8f7e]">
                  Certified adherence to strict Indian atelier decorative standards and 5-position chronometry.
                </p>
              </div>

              <div className="rounded-xl border border-[#c89b5c]/15 bg-[#0b0805] p-4">
                <Feather className="h-5 w-5 text-[#c89b5c]" />
                <h4 className="mt-2.5 font-serif text-lg text-[#f5efe6]">Hand-Finished Filigree</h4>
                <p className="mt-1 text-xs text-[#9c8f7e]">
                  140 hours of gentian wood and diamond paste beveling on solid rose-gold bridges.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={onExploreHorology}
                className="inline-flex items-center gap-2 rounded-full border border-[#c89b5c]/45 bg-[#c89b5c]/10 px-6 py-3 font-mono text-[11px] tracking-[0.25em] text-[#e6c697] uppercase transition-all hover:border-[#e6c697] hover:bg-[#c89b5c]/25"
              >
                Experience 3D Rotation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
