import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { FRAME_HEIGHT, FRAME_WIDTH } from '../config/watchSequence';
import type { FrameLookupResult } from '../hooks/useWatchFrames';

export interface WatchCanvasHandle {
  renderFrame: (
    targetIndex: number,
    transform?: { scale?: number; x?: number; y?: number }
  ) => void;
  getCanvasElement: () => HTMLCanvasElement | null;
}

interface WatchCanvasProps {
  getBestFrame: (targetIndex: number) => FrameLookupResult;
  requestWindowAround: (centerIndex: number) => void;
  subscribeFrameLoaded: (listener: (loadedIndex: number) => void) => () => void;
  initialFrame?: number;
}

export const WatchCanvas = forwardRef<WatchCanvasHandle, WatchCanvasProps>(
  function WatchCanvas(
    { getBestFrame, requestWindowAround, subscribeFrameLoaded, initialFrame = 0 },
    ref
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const targetFrameRef = useRef<number>(initialFrame);
    const transformRef = useRef<{ scale: number; x: number; y: number }>({
      scale: 1,
      x: 0,
      y: 0,
    });
    const lastDrawnResolvedRef = useRef<number>(-1);
    const lastSizeKeyRef = useRef<string>('');
    const rafIdRef = useRef<number | null>(null);
    const sizeRef = useRef<{ width: number; height: number; dpr: number }>({
      width: 0,
      height: 0,
      dpr: 1,
    });

    const paintCanvas = useCallback(
      (forceRedraw = false) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const { width, height, dpr } = sizeRef.current;
        if (width <= 0 || height <= 0) return;

        const desiredIndex = Math.round(targetFrameRef.current);
        const lookup = getBestFrame(desiredIndex);
        const { scale: animScale, x: animX, y: animY } = transformRef.current;
        const sizeKey = `${width}x${height}x${dpr}x${animScale.toFixed(3)}x${animX.toFixed(1)}x${animY.toFixed(1)}`;

        if (
          !forceRedraw &&
          lookup.resolvedIndex === lastDrawnResolvedRef.current &&
          sizeKey === lastSizeKeyRef.current &&
          lookup.frame !== null
        ) {
          return;
        }

        lastSizeKeyRef.current = sizeKey;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.fillStyle = '#050402';
        ctx.fillRect(0, 0, width, height);

        if (!lookup.frame) return;

        lastDrawnResolvedRef.current = lookup.resolvedIndex;

        const imgW =
          'naturalWidth' in lookup.frame && lookup.frame.naturalWidth > 0
            ? lookup.frame.naturalWidth
            : 'width' in lookup.frame && lookup.frame.width > 0
              ? lookup.frame.width
              : FRAME_WIDTH;
        const imgH =
          'naturalHeight' in lookup.frame && lookup.frame.naturalHeight > 0
            ? lookup.frame.naturalHeight
            : 'height' in lookup.frame && lookup.frame.height > 0
              ? lookup.frame.height
              : FRAME_HEIGHT;

        // Maintain exact aspect ratio and keep the watch centered without clipping
        // Apply smooth scale and translation transforms directly in canvas 2D space
        // for optimal 1:1 image sharpness (never blurred by CSS pixel stretching).
        const baseScale = Math.min(width / imgW, height / imgH);
        const totalScale = baseScale * animScale;
        const dw = imgW * totalScale;
        const dh = imgH * totalScale;
        const dx = (width - dw) / 2 + animX;
        const dy = (height - dh) / 2 + animY;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(lookup.frame, dx, dy, dw, dh);

        // Soft edge feather only on edges inside the viewport so warm key-light flares
        // dissolve seamlessly into the obsidian 100vh stage without hard seams.
        if (dy > 1) {
          const featherY = Math.max(18, Math.min(48, dh * 0.12));

          const topGrad = ctx.createLinearGradient(0, dy - 1, 0, dy + featherY);
          topGrad.addColorStop(0, '#050402');
          topGrad.addColorStop(1, 'rgba(5, 4, 2, 0)');
          ctx.fillStyle = topGrad;
          ctx.fillRect(dx - 2, dy - 2, dw + 4, featherY + 4);

          const bottomGrad = ctx.createLinearGradient(
            0,
            dy + dh - featherY,
            0,
            dy + dh + 1
          );
          bottomGrad.addColorStop(0, 'rgba(5, 4, 2, 0)');
          bottomGrad.addColorStop(1, '#050402');
          ctx.fillStyle = bottomGrad;
          ctx.fillRect(dx - 2, dy + dh - featherY, dw + 4, featherY + 4);
        }

        if (dx > 1) {
          const featherX = Math.max(18, Math.min(56, dw * 0.08));

          const leftGrad = ctx.createLinearGradient(dx - 1, 0, dx + featherX, 0);
          leftGrad.addColorStop(0, '#050402');
          leftGrad.addColorStop(1, 'rgba(5, 4, 2, 0)');
          ctx.fillStyle = leftGrad;
          ctx.fillRect(dx - 2, dy - 2, featherX + 4, dh + 4);

          const rightGrad = ctx.createLinearGradient(
            dx + dw - featherX,
            0,
            dx + dw + 1,
            0
          );
          rightGrad.addColorStop(0, 'rgba(5, 4, 2, 0)');
          rightGrad.addColorStop(1, '#050402');
          ctx.fillStyle = rightGrad;
          ctx.fillRect(dx + dw - featherX, dy - 2, featherX + 4, dh + 4);
        }
      },
      [getBestFrame]
    );

    const scheduleDraw = useCallback(
      (force = false) => {
        if (rafIdRef.current !== null && !force) return;
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
        }
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          paintCanvas(force);
        });
      },
      [paintCanvas]
    );

    useImperativeHandle(
      ref,
      () => ({
        renderFrame: (
          targetIndex: number,
          transform?: { scale?: number; x?: number; y?: number }
        ) => {
          targetFrameRef.current = targetIndex;
          if (transform) {
            if (transform.scale !== undefined) transformRef.current.scale = transform.scale;
            if (transform.x !== undefined) transformRef.current.x = transform.x;
            if (transform.y !== undefined) transformRef.current.y = transform.y;
          }
          requestWindowAround(targetIndex);
          scheduleDraw(false);
        },
        getCanvasElement: () => canvasRef.current,
      }),
      [requestWindowAround, scheduleDraw]
    );

    useEffect(() => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const updateSize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));

        sizeRef.current = { width: w, height: h, dpr };
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        paintCanvas(true);
      };

      updateSize();

      const observer = new ResizeObserver(updateSize);
      observer.observe(container);

      return () => {
        observer.disconnect();
        if (rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      };
    }, [paintCanvas]);

    useEffect(() => {
      const unsubscribe = subscribeFrameLoaded((loadedIndex) => {
        const currentTarget = Math.round(targetFrameRef.current);
        // Redraw immediately when the exact target frame or a closer fallback finishes decoding.
        if (
          Math.abs(loadedIndex - currentTarget) <=
          Math.abs(lastDrawnResolvedRef.current - currentTarget)
        ) {
          scheduleDraw(true);
        }
      });

      return unsubscribe;
    }, [scheduleDraw, subscribeFrameLoaded]);

    return (
      <div
        ref={containerRef}
        className="relative h-screen h-[100dvh] w-full overflow-hidden bg-[#050402]"
      >
        {/* Subtle studio key-light ambient aura matching the watch lighting direction */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 mix-blend-screen opacity-50"
          style={{
            background:
              'radial-gradient(ellipse 65% 55% at 22% 24%, rgba(200, 155, 92, 0.14) 0%, rgba(200, 155, 92, 0) 70%)',
          }}
        />
        <canvas
          ref={canvasRef}
          aria-label="Maison Aurelia Calibre AU-8920 3D interactive watch sequence"
          className="block h-full w-full"
        />
      </div>
    );
  }
);
