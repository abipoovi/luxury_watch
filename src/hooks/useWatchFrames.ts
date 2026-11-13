import { useCallback, useEffect, useRef, useState } from 'react';
import { getFramePath, TOTAL_FRAMES } from '../config/watchSequence';

export type DrawableFrame = ImageBitmap | HTMLImageElement;

interface CachedEntry {
  frame: DrawableFrame;
  isBitmap: boolean;
  lastUsed: number;
}

export interface FrameLookupResult {
  frame: DrawableFrame | null;
  isExact: boolean;
  resolvedIndex: number;
}

export interface WatchFramesState {
  isBootReady: boolean;
  bootProgress: number;
  cachedCount: number;
  totalFrames: number;
  getBestFrame: (targetIndex: number) => FrameLookupResult;
  requestWindowAround: (centerIndex: number) => void;
  subscribeFrameLoaded: (listener: (loadedIndex: number) => void) => () => void;
}

const ANCHOR_STEP = 15;
const BOOT_WINDOW_COUNT = 24;
const MAX_CONCURRENT_REQUESTS = 8;
const ACTIVE_WINDOW_RADIUS = 60;

/**
 * High-capacity decoded-bitmap cache cap to maintain buttery 60/120fps scrubbing
 * with zero stutter across desktop and mobile.
 */
function getAdaptiveCacheLimit(): number {
  if (typeof navigator === 'undefined') return 120;
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const isNarrow = typeof window !== 'undefined' && window.innerWidth < 768;

  if (deviceMemory && deviceMemory <= 2) return 60;
  if (deviceMemory && deviceMemory <= 4) return 90;
  if (isNarrow) return 80;
  return 160;
}

function isAnchorFrame(index: number): boolean {
  return index === 0 || index === TOTAL_FRAMES - 1 || index % ANCHOR_STEP === 0;
}

function disposeEntry(entry: CachedEntry): void {
  if (entry.isBitmap && 'close' in entry.frame) {
    try {
      (entry.frame as ImageBitmap).close();
    } catch {
      // Ignore already-closed ImageBitmap instances.
    }
  }
}

/**
 * Priority-queued, concurrency-limited, memory-bounded frame sequence loader.
 *
 * Strategy:
 * 1. Immediately boots critical frames: frames 0..21 plus coarse keyframes every 20 frames.
 * 2. Maintains a bounded LRU cache of decoded frames (`ImageBitmap` when supported,
 *    with deterministic `.close()` eviction outside the active scroll window).
 * 3. Dynamically reprioritizes queued frames nearest to the current scroll playhead.
 * 4. Always provides nearest-loaded fallback during rapid scrollbar drags so the
 *    canvas never flickers blank.
 */
export function useWatchFrames(): WatchFramesState {
  const [isBootReady, setIsBootReady] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);

  const cacheRef = useRef<Map<number, CachedEntry>>(new Map());
  const inFlightRef = useRef<Map<number, AbortController>>(new Map());
  const pendingSetRef = useRef<Set<number>>(new Set());
  const listenersRef = useRef<Set<(loadedIndex: number) => void>>(new Set());
  const playheadRef = useRef<number>(0);
  const tickCounterRef = useRef<number>(0);
  const maxCacheRef = useRef<number>(getAdaptiveCacheLimit());
  const isMountedRef = useRef<boolean>(false);
  const bootIndicesRef = useRef<Set<number>>(new Set());
  const bootLoadedRef = useRef<Set<number>>(new Set());
  const pumpScheduledRef = useRef<boolean>(false);

  const notifyListeners = useCallback((loadedIndex: number) => {
    listenersRef.current.forEach((listener) => listener(loadedIndex));
  }, []);

  const evictIfNeeded = useCallback(() => {
    const cache = cacheRef.current;
    const limit = maxCacheRef.current;
    if (cache.size <= limit) return;

    const currentCenter = playheadRef.current;

    while (cache.size > limit) {
      let victimIndex: number | null = null;
      let highestEvictionScore = -Infinity;

      for (const [idx, entry] of cache.entries()) {
        // Keep coarse timeline keyframes and immediate active window pinned when possible.
        const dist = Math.abs(idx - currentCenter);
        if (dist <= 16) continue;

        const anchorPenalty = isAnchorFrame(idx) ? -10000 : 0;
        const windowPenalty = dist <= ACTIVE_WINDOW_RADIUS ? -2000 : 0;
        const ageFactor = tickCounterRef.current - entry.lastUsed;
        const score = dist * 2 + ageFactor * 0.25 + anchorPenalty + windowPenalty;

        if (score > highestEvictionScore) {
          highestEvictionScore = score;
          victimIndex = idx;
        }
      }

      if (victimIndex === null) break;
      const victim = cache.get(victimIndex);
      if (victim) {
        disposeEntry(victim);
        cache.delete(victimIndex);
      }
    }
  }, []);

  const loadSingleFrame = useCallback(
    async (index: number, signal: AbortSignal): Promise<void> => {
      const url = getFramePath(index);
      const canUseBitmap = typeof createImageBitmap === 'function';

      if (canUseBitmap) {
        const response = await fetch(url, { signal });
        if (!response.ok) {
          throw new Error(`Failed to fetch frame ${index + 1}: ${response.status}`);
        }
        const blob = await response.blob();
        if (signal.aborted) return;

        const bitmap = await createImageBitmap(blob);
        if (signal.aborted) {
          bitmap.close();
          return;
        }

        if (!isMountedRef.current) {
          bitmap.close();
          return;
        }

        tickCounterRef.current += 1;
        cacheRef.current.set(index, {
          frame: bitmap,
          isBitmap: true,
          lastUsed: tickCounterRef.current,
        });
      } else {
        const img = await new Promise<HTMLImageElement>((resolve, reject) => {
          const element = new Image();
          element.decoding = 'async';
          const onAbort = () => {
            element.src = '';
            reject(new DOMException('Aborted', 'AbortError'));
          };
          signal.addEventListener('abort', onAbort, { once: true });

          element.onload = async () => {
            signal.removeEventListener('abort', onAbort);
            try {
              if (typeof element.decode === 'function') {
                await element.decode();
              }
            } catch {
              // Some browsers throw on decode() for already-decoded cached images.
            }
            resolve(element);
          };
          element.onerror = () => {
            signal.removeEventListener('abort', onAbort);
            reject(new Error(`Failed to load image frame ${index + 1}`));
          };
          element.src = url;
        });

        if (!isMountedRef.current || signal.aborted) return;

        tickCounterRef.current += 1;
        cacheRef.current.set(index, {
          frame: img,
          isBitmap: false,
          lastUsed: tickCounterRef.current,
        });
      }

      evictIfNeeded();

      if (bootIndicesRef.current.has(index)) {
        bootLoadedRef.current.add(index);
        const pct = Math.min(
          100,
          Math.round((bootLoadedRef.current.size / bootIndicesRef.current.size) * 100)
        );
        setBootProgress(pct);
        if (bootLoadedRef.current.size >= bootIndicesRef.current.size) {
          setIsBootReady(true);
        }
      }

      notifyListeners(index);
    },
    [evictIfNeeded, notifyListeners]
  );

  const pickNextFrameIndex = useCallback((): number | null => {
    const pending = pendingSetRef.current;
    if (pending.size === 0) return null;

    const center = playheadRef.current;
    let bestIdx: number | null = null;
    let bestScore = Infinity;

    for (const idx of pending) {
      // Highest priority: frame 0, then boot frames, then proximity to playhead.
      let priority = Math.abs(idx - center);
      if (idx === 0) priority -= 50000;
      else if (bootIndicesRef.current.has(idx)) priority -= 10000;
      else if (isAnchorFrame(idx)) priority -= 200;

      if (priority < bestScore) {
        bestScore = priority;
        bestIdx = idx;
      }
    }

    return bestIdx;
  }, []);

  const pumpQueueRef = useRef<() => void>(() => {});

  const schedulePump = useCallback(() => {
    if (pumpScheduledRef.current || !isMountedRef.current) return;
    pumpScheduledRef.current = true;
    queueMicrotask(() => {
      pumpScheduledRef.current = false;
      pumpQueueRef.current();
    });
  }, []);

  pumpQueueRef.current = () => {
    if (!isMountedRef.current) return;

    while (
      inFlightRef.current.size < MAX_CONCURRENT_REQUESTS &&
      pendingSetRef.current.size > 0
    ) {
      const nextIdx = pickNextFrameIndex();
      if (nextIdx === null) break;

      pendingSetRef.current.delete(nextIdx);
      if (cacheRef.current.has(nextIdx) || inFlightRef.current.has(nextIdx)) {
        continue;
      }

      const controller = new AbortController();
      inFlightRef.current.set(nextIdx, controller);

      loadSingleFrame(nextIdx, controller.signal)
        .catch(() => {
          // Ensure boot never hangs indefinitely if a single request fails.
          if (bootIndicesRef.current.has(nextIdx)) {
            bootLoadedRef.current.add(nextIdx);
            if (bootLoadedRef.current.size >= bootIndicesRef.current.size) {
              setIsBootReady(true);
            }
          }
        })
        .finally(() => {
          inFlightRef.current.delete(nextIdx);
          if (isMountedRef.current) {
            schedulePump();
          }
        });
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    maxCacheRef.current = getAdaptiveCacheLimit();

    const bootSet = new Set<number>();
    for (let i = 0; i < Math.min(BOOT_WINDOW_COUNT, TOTAL_FRAMES); i++) {
      bootSet.add(i);
    }
    for (let i = 0; i < TOTAL_FRAMES; i += ANCHOR_STEP) {
      bootSet.add(i);
    }
    bootSet.add(TOTAL_FRAMES - 1);
    bootIndicesRef.current = bootSet;
    bootLoadedRef.current = new Set();

    const pending = new Set<number>();
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      pending.add(i);
    }
    pendingSetRef.current = pending;

    // Failsafe guarantee so Preloader never blocks on slow networks.
    const failsafeTimer = window.setTimeout(() => {
      if (isMountedRef.current) {
        setIsBootReady(true);
      }
    }, 3500);

    schedulePump();

    return () => {
      isMountedRef.current = false;
      window.clearTimeout(failsafeTimer);
      inFlightRef.current.forEach((ctrl) => ctrl.abort());
      inFlightRef.current.clear();
      pendingSetRef.current.clear();
      cacheRef.current.forEach(disposeEntry);
      cacheRef.current.clear();
    };
  }, [schedulePump]);

  const requestWindowAround = useCallback(
    (centerIndex: number) => {
      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(centerIndex)));
      playheadRef.current = clamped;

      // Re-enqueue any previously evicted frames inside the active sliding window.
      const start = Math.max(0, clamped - ACTIVE_WINDOW_RADIUS);
      const end = Math.min(TOTAL_FRAMES - 1, clamped + ACTIVE_WINDOW_RADIUS);
      let added = false;

      for (let i = start; i <= end; i++) {
        if (!cacheRef.current.has(i) && !inFlightRef.current.has(i)) {
          if (!pendingSetRef.current.has(i)) {
            pendingSetRef.current.add(i);
            added = true;
          }
        }
      }

      if (added || pendingSetRef.current.size > 0) {
        schedulePump();
      }
    },
    [schedulePump]
  );

  const getBestFrame = useCallback((targetIndex: number): FrameLookupResult => {
    const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(targetIndex)));
    const cache = cacheRef.current;

    const exact = cache.get(clamped);
    if (exact) {
      tickCounterRef.current += 1;
      exact.lastUsed = tickCounterRef.current;
      return {
        frame: exact.frame,
        isExact: true,
        resolvedIndex: clamped,
      };
    }

    // Search symmetrically outward for nearest decoded frame so scrubbing never flashes blank.
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const lower = clamped - offset;
      if (lower >= 0) {
        const lowerEntry = cache.get(lower);
        if (lowerEntry) {
          tickCounterRef.current += 1;
          lowerEntry.lastUsed = tickCounterRef.current;
          return {
            frame: lowerEntry.frame,
            isExact: false,
            resolvedIndex: lower,
          };
        }
      }

      const upper = clamped + offset;
      if (upper < TOTAL_FRAMES) {
        const upperEntry = cache.get(upper);
        if (upperEntry) {
          tickCounterRef.current += 1;
          upperEntry.lastUsed = tickCounterRef.current;
          return {
            frame: upperEntry.frame,
            isExact: false,
            resolvedIndex: upper,
          };
        }
      }
    }

    return {
      frame: null,
      isExact: false,
      resolvedIndex: clamped,
    };
  }, []);

  const subscribeFrameLoaded = useCallback((listener: (loadedIndex: number) => void) => {
    listenersRef.current.add(listener);
    return () => {
      listenersRef.current.delete(listener);
    };
  }, []);

  return {
    isBootReady,
    bootProgress,
    cachedCount: cacheRef.current.size,
    totalFrames: TOTAL_FRAMES,
    getBestFrame,
    requestWindowAround,
    subscribeFrameLoaded,
  };
}
