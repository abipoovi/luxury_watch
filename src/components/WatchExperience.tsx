import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  EXPLODED_COMPONENTS,
  TOTAL_FRAMES,
  WATCH_CHAPTERS,
  type ChapterId,
} from '../config/watchSequence';
import type { WatchFramesState } from '../hooks/useWatchFrames';
import { WatchCanvas, type WatchCanvasHandle } from './WatchCanvas';
import { HeroOverlay } from './HeroOverlay';
import { RotationOverlay, type RotationOverlayHandle } from './RotationOverlay';
import { ExplodedOverlay } from './ExplodedOverlay';
import {
  ScrollProgressRail,
  type ScrollProgressRailHandle,
} from './ScrollProgressRail';

gsap.registerPlugin(ScrollTrigger);

export interface WatchExperienceHandle {
  jumpToChapter: (chapter: ChapterId) => void;
}

interface WatchExperienceProps {
  framesState: WatchFramesState;
  onSectionChange: (section: ChapterId) => void;
  onExploreAbout?: () => void;
}

export const WatchExperience = forwardRef<WatchExperienceHandle, WatchExperienceProps>(
  function WatchExperience(
    { framesState, onSectionChange, onExploreAbout },
    ref
  ) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<WatchCanvasHandle>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const rotationRef = useRef<RotationOverlayHandle>(null);
    const explodedRef = useRef<HTMLDivElement>(null);
    const railRef = useRef<ScrollProgressRailHandle>(null);
    const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

    const [activeChapter, setActiveChapter] = useState<ChapterId>('hero');
    const [activePartIndex, setActivePartIndex] = useState<number>(0);

    const lastChapterRef = useRef<ChapterId>('hero');
    const lastPartRef = useRef<number>(0);
    const lastProgressRef = useRef<number>(0);
    const manualPartLockRef = useRef<number | null>(null);

    const jumpToProgress = useCallback((progress: number) => {
      const st = scrollTriggerRef.current;
      if (!st) return;
      const clamped = Math.max(0, Math.min(1, progress));
      const targetY = st.start + (st.end - st.start) * clamped;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }, []);

    const jumpToChapter = useCallback(
      (chapterId: ChapterId) => {
        const chapter = WATCH_CHAPTERS.find((c) => c.id === chapterId);
        if (!chapter) return;
        manualPartLockRef.current = null;
        jumpToProgress(chapter.targetProgress);
      },
      [jumpToProgress]
    );

    useImperativeHandle(
      ref,
      () => ({
        jumpToChapter,
      }),
      [jumpToChapter]
    );

    const handleSelectPart = useCallback(
      (index: number, revealProgress: number) => {
        manualPartLockRef.current = index;
        lastPartRef.current = index;
        setActivePartIndex(index);
        jumpToProgress(revealProgress);
        window.setTimeout(() => {
          manualPartLockRef.current = null;
        }, 900);
      },
      [jumpToProgress]
    );

    useLayoutEffect(() => {
      ScrollTrigger.config({ ignoreMobileResize: true });

      const ctx = gsap.context(() => {
        const stageEl = stageRef.current;
        const heroEl = heroRef.current;
        const rotationHandle = rotationRef.current;
        const explodedEl = explodedRef.current;

        if (
          !stageEl ||
          !heroEl ||
          !rotationHandle?.root ||
          !rotationHandle.beatOne ||
          !rotationHandle.beatTwo ||
          !explodedEl
        ) {
          return;
        }

        const watchTransform = {
          frame: 0,
          scale: 0.96,
          x: 0,
          y: 12,
        };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: stageEl,
            start: 'top top',
            end: () => (window.innerWidth < 768 ? '+=2200' : '+=2800'),
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onLeave: () => {
              onSectionChange('exploded');
            },
            onEnterBack: () => {
              onSectionChange(lastChapterRef.current);
            },
            onUpdate: (self) => {
              const progress = self.progress;
              lastProgressRef.current = progress;

              const nextChapter: ChapterId =
                progress < 0.22
                  ? 'hero'
                  : progress < 0.61
                    ? 'rotation'
                    : 'exploded';

              if (nextChapter !== lastChapterRef.current) {
                lastChapterRef.current = nextChapter;
                setActiveChapter(nextChapter);
                if (self.isActive) {
                  onSectionChange(nextChapter);
                }
              }

              // Step through the 5 exploded layers smoothly once inside Phase III.
              if (progress >= 0.61 && manualPartLockRef.current === null) {
                let matchedIdx = 0;
                for (let i = 0; i < EXPLODED_COMPONENTS.length; i++) {
                  if (progress >= EXPLODED_COMPONENTS[i].revealProgress - 0.03) {
                    matchedIdx = i;
                  }
                }
                if (matchedIdx !== lastPartRef.current) {
                  lastPartRef.current = matchedIdx;
                  setActivePartIndex(matchedIdx);
                }
              }
            },
          },
        });

        scrollTriggerRef.current = timeline.scrollTrigger ?? null;

        const isMobile = window.innerWidth < 768;

        // 1. Sequential frame scrub synchronized with the user's scroll position
        timeline.to(
          watchTransform,
          {
            frame: TOTAL_FRAMES - 1,
            ease: 'none',
            duration: 10,
            onUpdate: () => {
              canvasRef.current?.renderFrame(watchTransform.frame, {
                scale: watchTransform.scale,
                x: watchTransform.x,
                y: watchTransform.y,
              });
              railRef.current?.updateTelemetry(
                lastProgressRef.current,
                watchTransform.frame
              );
            },
          },
          0
        );

        // 2. Cinematic camera motion on the watch image
        timeline.to(
          watchTransform,
          {
            scale: 1.0,
            y: 0,
            ease: 'power2.out',
            duration: 2.0,
          },
          0
        );

        timeline.to(
          watchTransform,
          {
            scale: isMobile ? 1.0 : 1.03,
            x: isMobile ? 0 : -14,
            y: isMobile ? -8 : 0,
            ease: 'power1.inOut',
            duration: 3.6,
          },
          2.0
        );

        timeline.to(
          watchTransform,
          {
            scale: 1.0,
            x: 0,
            y: 0,
            ease: 'power2.out',
            duration: 2.5,
          },
          5.6
        );

        // 3. Phase I -> II transition: Hero exit
        timeline.to(
          heroEl,
          {
            autoAlpha: 0,
            y: -26,
            duration: 0.75,
            ease: 'power2.inOut',
          },
          1.55
        );

        // 4. Phase II: Watch Rotation Beat 1 & Beat 2
        timeline.fromTo(
          rotationHandle.root,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.45, ease: 'power2.out' },
          1.6
        );

        timeline.fromTo(
          rotationHandle.beatOne,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          1.7
        );

        timeline.to(
          rotationHandle.beatOne,
          {
            autoAlpha: 0,
            y: -18,
            duration: 0.5,
            ease: 'power2.inOut',
          },
          3.7
        );

        timeline.fromTo(
          rotationHandle.beatTwo,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          3.85
        );

        timeline.to(
          [rotationHandle.beatTwo, rotationHandle.root],
          {
            autoAlpha: 0,
            y: -18,
            duration: 0.55,
            ease: 'power2.inOut',
          },
          5.6
        );

        // 5. Phase III: Exploded-View Deconstruction
        timeline.fromTo(
          explodedEl,
          { autoAlpha: 0, y: 22 },
          { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' },
          5.7
        );
      }, wrapperRef);

      return () => {
        scrollTriggerRef.current = null;
        ctx.revert();
      };
    }, [onSectionChange]);

    return (
      <section ref={wrapperRef} id="watch-experience" className="relative bg-[#050402]">
        <div
          ref={stageRef}
          className="relative h-screen h-[100dvh] w-full overflow-hidden bg-[#050402]"
        >
          <WatchCanvas
            ref={canvasRef}
            getBestFrame={framesState.getBestFrame}
            requestWindowAround={framesState.requestWindowAround}
            subscribeFrameLoaded={framesState.subscribeFrameLoaded}
            initialFrame={0}
          />

          <HeroOverlay
            ref={heroRef}
            onExploreClick={() => jumpToChapter('rotation')}
            onExploreAbout={() => {
              if (onExploreAbout) onExploreAbout();
            }}
          />

          <RotationOverlay ref={rotationRef} />

          <ExplodedOverlay
            ref={explodedRef}
            activePartIndex={activePartIndex}
            onSelectPart={handleSelectPart}
          />

          <ScrollProgressRail
            ref={railRef}
            activeChapter={activeChapter}
            onJumpToChapter={jumpToChapter}
          />
        </div>
      </section>
    );
  }
);
