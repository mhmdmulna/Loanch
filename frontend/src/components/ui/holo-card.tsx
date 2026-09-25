"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const MOTIQ_TOKENS = "@layer motiq{:root,.dark,[data-theme=\"dark\"]{--motiq-accent:#31d0a3;--motiq-accent-text:#8ce6d0;--motiq-bg:#071524;--motiq-border:rgba(49,208,163,0.25);--motiq-border-strong:rgba(49,208,163,0.4);--motiq-fg:#ffffff;--motiq-fg-secondary:#c4e0dd;--motiq-muted:#94a3b8;--motiq-secondary-accent:#0fa78f;--motiq-surface:#0f2538;--motiq-surface-2:#091a27}}";

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

function useVisibilityPause<T extends Element>(
  ref: React.RefObject<T | null>,
  { threshold = 0.1 }: { threshold?: number } = {},
): boolean {
  const [onScreen, setOnScreen] = React.useState(true);
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => setOnScreen(entries.some((e) => e.isIntersecting)),
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);

  React.useEffect(() => {
    const onVis = () => setTabVisible(document.visibilityState !== "hidden");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return onScreen && tabVisible;
}

export type HoloCardFoil = "azure" | "spectral" | "none";

export interface HoloCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  maxTilt?: number;
  spring?: { stiffness?: number; damping?: number };
  foil?: HoloCardFoil;
  glare?: boolean;
  shadow?: boolean;
  idleSway?: boolean;
  aspect?: number;
  label?: string;
  onTilt?: (rx: number, ry: number) => void;
  pauseWhenHidden?: boolean;
  reducedMotion?: boolean;
}

class Spring {
  x: number;
  v = 0;
  target: number;
  k: number;
  d: number;
  constructor(value: number, k: number, d: number) {
    this.x = value;
    this.target = value;
    this.k = k;
    this.d = d;
  }
  step(dt: number): number {
    const a = this.k * (this.target - this.x) - this.d * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
    return this.x;
  }
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

const TILT_X_RATIO = 11 / 14;
const TILT_Y_RATIO = 15 / 14;
const REST = { rx: -6, ry: 8, px: 0.62, py: 0.3 };

const ACCENT = "var(--motiq-accent, #31d0a3)";
const ACCENT_TEXT = "var(--motiq-accent-text, #8ce6d0)";
const CYAN = "var(--motiq-secondary-accent, #0fa78f)";

function foilBackground(foil: HoloCardFoil): string | undefined {
  if (foil === "none") return undefined;
  const rake =
    "repeating-linear-gradient(115deg, rgba(49,208,163,0.08) 0px, rgba(49,208,163,0.08) 1px, transparent 1px, transparent 5px)";
  const at = "at calc(var(--mk-holo-px, 0.5) * 100%) calc(var(--mk-holo-py, 0.5) * 100%)";
  if (foil === "azure") {
    return `${rake}, conic-gradient(from 210deg ${at}, ${ACCENT} 0deg, ${ACCENT_TEXT} 120deg, ${ACCENT} 240deg, ${ACCENT_TEXT} 360deg)`;
  }
  const mint = `color-mix(in srgb, ${CYAN} 52%, #ffffff)`;
  const deep = `color-mix(in srgb, ${ACCENT} 78%, #000000)`;
  return `${rake}, conic-gradient(from 210deg ${at}, ${ACCENT} 0deg, ${CYAN} 90deg, ${mint} 160deg, ${ACCENT} 230deg, ${deep} 300deg, ${ACCENT} 360deg)`;
}

function HoloCardBase({
  children,
  maxTilt = 14,
  spring,
  foil = "spectral",
  glare = true,
  shadow = true,
  idleSway = true,
  aspect = 1.586,
  label = "Interactive tilt card",
  onTilt,
  pauseWhenHidden = true,
  reducedMotion,
  className,
  style,
  ...props
}: HoloCardProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const cls = `mk-holo-${uid}`;
  const hintId = `${cls}-hint`;

  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const cardRef = React.useRef<HTMLDivElement | null>(null);
  const shadowRef = React.useRef<HTMLDivElement | null>(null);

  const systemReduced = useReducedMotion();
  const [hydrated, setHydrated] = React.useState(false);
  React.useEffect(() => setHydrated(true), []);
  const staticMode = reducedMotion === true || (hydrated && systemReduced);
  const onScreen = useVisibilityPause(rootRef, { threshold: 0.05 });
  const paused = pauseWhenHidden && !onScreen;
  const animate = !staticMode && !paused;

  const maxY = Math.abs(maxTilt) * TILT_Y_RATIO;
  const maxX = Math.abs(maxTilt) * TILT_X_RATIO;

  const stiffness = spring?.stiffness ?? 120;
  const damping = spring?.damping ?? 10;

  const springsRef = React.useRef({ sx: new Spring(0, stiffness, damping), sy: new Spring(0, stiffness, damping) });
  const lightRef = React.useRef({ px: 0.5, py: 0.5, hovering: false });
  const emittedRef = React.useRef({ rx: 0, ry: 0 });
  const liveRef = React.useRef({ maxX, maxY, idleSway, onTilt, staticMode });
  liveRef.current = { maxX, maxY, idleSway, onTilt, staticMode };

  React.useEffect(() => {
    springsRef.current.sx.k = stiffness;
    springsRef.current.sy.k = stiffness;
    springsRef.current.sx.d = damping;
    springsRef.current.sy.d = damping;
  }, [stiffness, damping]);

  const render = React.useCallback((rx: number, ry: number) => {
    const card = cardRef.current;
    if (!card) return;
    const { px, py } = lightRef.current;
    const { maxX: mx, maxY: my, onTilt: cb } = liveRef.current;
    card.style.transform = `rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
    card.style.setProperty("--mk-holo-px", px.toFixed(4));
    card.style.setProperty("--mk-holo-py", py.toFixed(4));
    card.style.setProperty("--mk-holo-hue", (ry * 4 + (px - 0.5) * 40).toFixed(2));
    const lean = (Math.abs(rx) + Math.abs(ry)) / Math.max(1, mx + my);
    card.style.setProperty("--mk-holo-glare-o", (0.25 + lean * 0.45).toFixed(3));
    const sh = shadowRef.current;
    if (sh) {
      sh.style.transform = `translate3d(${(-ry * 1.8).toFixed(2)}px, ${(rx * 1.2).toFixed(2)}px, 0) scale(${(1 + lean * 0.08).toFixed(3)})`;
      sh.style.opacity = (0.75 + lean * 0.25).toFixed(3);
    }
    const prev = emittedRef.current;
    if (cb && (Math.abs(prev.rx - rx) > 0.05 || Math.abs(prev.ry - ry) > 0.05)) {
      emittedRef.current = { rx, ry };
      cb(rx, ry);
    }
  }, []);

  React.useEffect(() => {
    if (!animate) return;
    let raf = 0;
    let last = 0;
    let t = 0;
    const frame = (now: number) => {
      if (!last) last = now;
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      t += dt;
      const { sx, sy } = springsRef.current;
      const light = lightRef.current;
      const { maxX: mx, maxY: my, idleSway: sway } = liveRef.current;
      if (!light.hovering) {
        if (sway) {
          sy.target = clamp(Math.sin(t * 0.5) * 4, -my, my);
          sx.target = clamp(Math.cos(t * 0.37) * 3, -mx, mx);
        } else {
          sy.target = 0;
          sx.target = 0;
        }
        const rate = Math.min(1, dt * 2);
        light.px += (0.5 - light.px) * rate;
        light.py += (0.5 - light.py) * rate;
      }
      render(sx.step(dt), sy.step(dt));
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [animate, render]);

  React.useEffect(() => {
    if (!staticMode) return;
    const { sx, sy } = springsRef.current;
    sx.x = sx.target = REST.rx;
    sy.x = sy.target = REST.ry;
    sx.v = 0;
    sy.v = 0;
    lightRef.current = { px: REST.px, py: REST.py, hovering: false };
    render(REST.rx, REST.ry);
  }, [staticMode, render]);

  const trackPointer = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (liveRef.current.staticMode) return;
      const card = cardRef.current;
      if (!card) return;
      const r = card.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const px = clamp((e.clientX - r.left) / r.width, 0, 1);
      const py = clamp((e.clientY - r.top) / r.height, 0, 1);
      const light = lightRef.current;
      light.px = px;
      light.py = py;
      light.hovering = true;
      const { maxX: mx, maxY: my } = liveRef.current;
      springsRef.current.sy.target = (px - 0.5) * 2 * my;
      springsRef.current.sx.target = -(py - 0.5) * 2 * mx;
    },
    [],
  );

  const release = React.useCallback(() => {
    lightRef.current.hovering = false;
  }, []);

  const onKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (liveRef.current.staticMode) return;
    const { sx, sy } = springsRef.current;
    const { maxX: mx, maxY: my } = liveRef.current;
    const step = 4;
    let used = true;
    if (e.key === "ArrowLeft") sy.target = Math.max(-my, sy.target - step);
    else if (e.key === "ArrowRight") sy.target = Math.min(my, sy.target + step);
    else if (e.key === "ArrowUp") sx.target = Math.min(mx, sx.target + step);
    else if (e.key === "ArrowDown") sx.target = Math.max(-mx, sx.target - step);
    else if (e.key === "Escape") {
      sx.target = 0;
      sy.target = 0;
    } else used = false;
    if (used) {
      lightRef.current.hovering = true;
      e.preventDefault();
    }
  }, []);

  const foilBg = foilBackground(foil);

  const css = `
.${cls} {
  --mk-holo-blend: color-dodge;
  --mk-holo-foil-o: 0.38;
  --mk-holo-glare: rgba(49, 208, 163, 0.45);
  --mk-holo-shadow: rgba(0, 0, 0, 0.55);
  --mk-holo-stroke: rgba(49, 208, 163, 0.3);
}
.${cls} .mk-holo-card { touch-action: none; }
.${cls} .mk-holo-foil {
  mix-blend-mode: var(--mk-holo-blend);
  opacity: var(--mk-holo-foil-o);
  filter: hue-rotate(calc(var(--mk-holo-hue, 0) * 1deg)) saturate(1.3);
  transform: translateZ(0);
}
.${cls} .mk-holo-glare {
  mix-blend-mode: screen;
  opacity: var(--mk-holo-glare-o, 0.35);
  transform: translateZ(0);
}
@media (forced-colors: active) {
  .${cls} .mk-holo-foil, .${cls} .mk-holo-glare, .${cls} .mk-holo-shadow { display: none; }
}`.trim();

  return (
    <div
      ref={rootRef}
      data-motion={staticMode ? "static" : "animated"}
      data-paused={paused ? "true" : "false"}
      className={cn("relative w-full", cls, className)}
      style={{ perspective: "1100px", ...style }}
      onPointerMove={trackPointer}
      onPointerDown={trackPointer}
      onPointerLeave={release}
      onPointerCancel={release}
      onPointerUp={(e) => {
        if (e.pointerType !== "mouse") release();
      }}
      {...props}
    >
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {shadow ? (
        <div
          ref={shadowRef}
          aria-hidden="true"
          className="mk-holo-shadow pointer-events-none absolute bottom-[-26px] left-[8%] right-[8%] h-11 rounded-[50%] will-change-transform"
          style={{
            background: "radial-gradient(50% 50% at 50% 50%, var(--mk-holo-shadow), transparent 70%)",
          }}
        />
      ) : null}

      <div
        ref={cardRef}
        role="group"
        aria-label={label}
        aria-describedby={hintId}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={release}
        className={cn(
          "mk-holo-card relative w-full select-none overflow-hidden rounded-2xl outline-none will-change-transform",
          "border border-[rgba(49,208,163,0.3)]",
          "focus-visible:ring-2 focus-visible:ring-[#31d0a3] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
        )}
        style={{
          aspectRatio: aspect > 0 ? String(aspect) : undefined,
          transformStyle: "preserve-3d",
          background:
            "linear-gradient(145deg, rgba(15, 37, 56, 0.95), rgba(7, 21, 36, 0.95) 55%, rgba(15, 37, 56, 0.95))",
          boxShadow: "inset 0 1px 0 var(--mk-holo-stroke), 0 20px 50px rgba(0, 0, 0, 0.4)",
        }}
      >
        {foilBg ? (
          <div
            aria-hidden="true"
            className="mk-holo-foil pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: foilBg }}
          />
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[100px] -top-[100px] h-[210px] w-[210px] rounded-full border border-[rgba(211,255,245,0.12)] shadow-[0_0_0_43px_rgba(211,255,245,0.028),0_0_0_85px_rgba(211,255,245,0.018)]"
          style={{ transform: "translateZ(0)" }}
        />

        <div className="relative flex h-full w-full flex-col justify-between gap-3 p-6" style={{ transform: "translateZ(1px)" }}>
          {children}
        </div>

        {glare ? (
          <div
            aria-hidden="true"
            className="mk-holo-glare pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{
              background:
                "radial-gradient(220px circle at calc(var(--mk-holo-px, 0.5) * 100%) calc(var(--mk-holo-py, 0.5) * 100%), var(--mk-holo-glare), transparent 65%)",
            }}
          />
        ) : null}
      </div>

      <span id={hintId} className="sr-only">
        Use the arrow keys to tilt the card, Escape to level it.
      </span>
    </div>
  );
}

export function HoloCard(props: HoloCardProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: MOTIQ_TOKENS }} />
      <HoloCardBase {...props} />
    </>
  );
}

export default HoloCard;
