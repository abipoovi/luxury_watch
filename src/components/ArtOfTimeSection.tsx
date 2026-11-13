import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Feather, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ArtOfTimeSection() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Wrap in gsap.context with containerRef scoping for complete cleanup
    const ctx = gsap.context(() => {
      // 1. Smooth editorial heading & intro reveal
      gsap.fromTo(
        '.art-title-reveal',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      );

      // 2. Subtle image container reveal and gentle vertical parallax
      gsap.fromTo(
        '.art-image-wrapper',
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.art-image-wrapper',
            start: 'top 88%',
            once: true,
          },
        }
      );

      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      }

      // 3. Reliable, foolproof reveal for the three supporting philosophy highlights
      // Using fromTo with once: true guarantees they will NEVER be stuck at opacity: 0
      gsap.fromTo(
        '.art-highlight-item',
        { y: 25, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          clearProps: 'opacity,transform', // Clears all inline styles after animation so cards are 100% visible
          scrollTrigger: {
            trigger: '.art-highlights-grid',
            start: 'top 92%',
            once: true,
            onEnter: () => {
              // Ensure elements are immediately made visible
              const items = document.querySelectorAll('.art-highlight-item');
              items.forEach((item) => {
                (item as HTMLElement).style.opacity = '1';
              });
            },
          },
        }
      );
    }, containerRef);

    // Refresh ScrollTrigger once DOM layout and images settle
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  const highlights = [
    {
      icon: Feather,
      title: 'Timeless Design',
      description: 'Elegance that never follows trends.',
      tag: '01 · Aesthetic',
    },
    {
      icon: Compass,
      title: 'Thoughtful Precision',
      description: 'Every detail deserves attention.',
      tag: '02 · Engineering',
    },
    {
      icon: Sparkles,
      title: 'Inspired by India',
      description: 'A modern expression of Indian luxury.',
      tag: '03 · Provenance',
    },
  ];

  return (
    <section
      ref={containerRef}
      id="art-of-time"
      className="relative overflow-hidden border-t border-[#c89b5c]/20 bg-[#050402] px-5 py-28 sm:px-8 sm:py-36 lg:px-14"
    >
      {/* Subtle Warm Atmospheric Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full opacity-20 blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(200, 155, 92, 0.35) 0%, rgba(5, 4, 2, 0) 70%)',
        }}
      />

      <div className="relative mx-auto max-w-[1320px]">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="art-title-reveal inline-flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#c89b5c]" />
            <span className="font-mono text-[10px] tracking-[0.4em] text-[#c89b5c] uppercase sm:text-[11px]">
              THE ART OF TIME
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#c89b5c]" />
          </div>

          <h2 className="art-title-reveal mt-5 font-serif text-3xl font-light tracking-[0.02em] text-[#f5efe6] sm:text-5xl lg:text-6xl">
            Beyond Seconds.{' '}
            <span className="block italic text-gold-gradient">Beyond Generations.</span>
          </h2>

          <div className="art-title-reveal mx-auto mt-6 max-w-2xl space-y-3 text-sm leading-relaxed text-[#c4b5a0] sm:text-base">
            <p>
              Time is more than a measure. It is a reflection of ambition, memories, and
              moments that define us.
            </p>
            <p className="text-xs text-[#9c8f7e] sm:text-sm">
              AURELIA brings together timeless elegance and thoughtful precision, creating
              watches inspired by the spirit of India and designed to be treasured for
              generations.
            </p>
          </div>
        </div>

        {/* Cinematic Masterpiece Watch Showcase with Dramatic Lighting */}
        <div className="art-image-wrapper relative mt-16 overflow-hidden rounded-3xl border border-[#c89b5c]/25 bg-gradient-to-b from-[#0b0805] via-[#070503] to-[#050402] p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] sm:p-3">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black">
            <img
              ref={imageRef}
              src="/indian_luxury/art-of-time-masterpiece.jpg"
              alt="AURELIA Haute Horlogerie Masterpiece in Chiaroscuro Golden Light"
              className="h-[112%] w-full -translate-y-[6%] object-cover"
              loading="lazy"
              onLoad={() => {
                ScrollTrigger.refresh();
              }}
            />

            {/* Seamless Vignette & Accent Flare */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050402] via-[#050402]/20 to-transparent opacity-90" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050402]/60 via-transparent to-[#050402]/60" />

            {/* Floating Brand Inscription */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between sm:bottom-8 sm:left-8 sm:right-8">
              <div className="space-y-1">
                <span className="font-mono text-[9px] tracking-[0.3em] text-[#e6c697] uppercase sm:text-[10px]">
                  Calibre AU-8920 · Haute Horlogerie
                </span>
                <p className="font-serif text-lg font-light text-[#f5efe6] sm:text-2xl">
                  The Soul of Indian Precision
                </p>
              </div>

              <span className="hidden font-mono text-[10px] tracking-[0.25em] text-[#9c8f7e] uppercase sm:inline-block">
                Atelier Aurelia · 1920 × 1080 Native
              </span>
            </div>
          </div>
        </div>

        {/* 3 Supporting Philosophy Highlights */}
        <div className="art-highlights-grid mt-14 grid gap-6 sm:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="art-highlight-item group relative flex flex-col justify-between rounded-2xl border border-[#c89b5c]/20 bg-[#0a0805]/90 p-7 transition-all duration-500 hover:border-[#c89b5c]/55 hover:bg-[#120d08]/90"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c89b5c]/30 bg-[#060402] text-[#e6c697] transition-colors group-hover:border-[#e6c697]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.25em] text-[#9c8f7e] uppercase">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 font-serif text-2xl font-light text-[#f5efe6] transition-colors group-hover:text-[#e6c697]">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 text-xs leading-relaxed text-[#b9ab98] sm:text-sm">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 h-px w-12 bg-[#c89b5c]/30 transition-all duration-300 group-hover:w-full group-hover:bg-[#c89b5c]" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
