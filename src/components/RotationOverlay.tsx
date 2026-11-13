import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface RotationOverlayHandle {
  root: HTMLDivElement | null;
  beatOne: HTMLDivElement | null;
  beatTwo: HTMLDivElement | null;
}

export const RotationOverlay = forwardRef<RotationOverlayHandle>(
  function RotationOverlay(_props, ref) {
    const rootRef = useRef<HTMLDivElement>(null);
    const beatOneRef = useRef<HTMLDivElement>(null);
    const beatTwoRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      get root() {
        return rootRef.current;
      },
      get beatOne() {
        return beatOneRef.current;
      },
      get beatTwo() {
        return beatTwoRef.current;
      },
    }));

    return (
      <div
        ref={rootRef}
        className="pointer-events-none absolute inset-0 z-20 opacity-0 invisible"
      >
        {/* Beat 1: Frontal Jali Dial & Ceramic Octa-Bezel */}
        <div
          ref={beatOneRef}
          className="absolute inset-x-4 bottom-6 mx-auto max-w-md md:inset-x-auto md:left-8 md:top-1/2 md:bottom-auto md:mx-0 md:max-w-[340px] md:-translate-y-1/2 lg:left-14 lg:max-w-[380px]"
        >
          <div className="luxury-glass rounded-2xl p-5 sm:p-6 md:rounded-none md:border-y-0 md:border-r-0 md:border-l md:border-[#c89b5c]/35 md:bg-transparent md:bg-none md:backdrop-blur-none md:shadow-none md:pl-6 md:pr-0 md:py-2">
            <p className="font-mono text-[10px] tracking-[0.32em] text-[#c89b5c] uppercase">
              02 · Royal Geometry
            </p>
            <h2 className="mt-2 font-serif text-2xl font-light tracking-wide text-[#f5efe6] sm:text-3xl lg:text-4xl">
              Jali Lattice &{' '}
              <span className="italic text-[#e6c697]">Octagonal Ceramic</span>
            </h2>
            <p className="mt-2.5 text-xs leading-relaxed text-[#b9ab98] sm:text-sm">
              Eight rose-gold fasteners lock the zirconia bezel into place, echoing the
              sacred octagonal bastions of royal Indian citadels. Hand-beveled skeleton
              bridges frame the Roman XII marker.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-[#e6c697]/85 uppercase">
              <span className="rounded-full border border-[#c89b5c]/30 px-2.5 py-1">
                Matte ZrO₂ Bezel
              </span>
              <span className="rounded-full border border-[#c89b5c]/30 px-2.5 py-1">
                6H Ruby Balance
              </span>
            </div>
          </div>
        </div>

        {/* Beat 2: Side Profile Flank & Chronograph Pushers */}
        <div
          ref={beatTwoRef}
          className="invisible opacity-0 absolute inset-x-4 bottom-6 mx-auto max-w-md md:inset-x-auto md:right-14 md:bottom-14 md:mx-0 md:max-w-[350px] lg:right-20 lg:bottom-16"
        >
          <div className="luxury-glass rounded-2xl p-5 sm:p-6">
            <p className="font-mono text-[10px] tracking-[0.32em] text-[#c89b5c] uppercase">
              Monocoque Flank · 11.8 mm
            </p>
            <h3 className="mt-2 font-serif text-2xl font-light tracking-wide text-[#f5efe6] sm:text-3xl">
              18K Rose Gold{' '}
              <span className="italic text-[#e6c697]">Sculpted Profile</span>
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-[#b9ab98] sm:text-sm">
              Alternating hand-satin brushing and mirror-angled chamfers cradle the fluted
              crown, secured to full-grain vegetable-tanned saddle alligator leather.
            </p>
          </div>
        </div>
      </div>
    );
  }
);
