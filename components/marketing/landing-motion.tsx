"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Script from "next/script";

type AnimationVars = Record<string, unknown>;

type GsapMatchMedia = {
  add: (query: string, setup: () => void | (() => void)) => void;
  revert: () => void;
};

type GsapApi = {
  registerPlugin: (plugin: unknown) => void;
  matchMedia: () => GsapMatchMedia;
  utils: { toArray: <T extends Element>(selector: string) => T[] };
  fromTo: (target: Element, fromVars: AnimationVars, toVars: AnimationVars) => unknown;
};

type ScrollTriggerApi = {
  create: (config: Record<string, unknown>) => { kill: () => void };
};

declare global {
  interface Window {
    gsap?: GsapApi;
    ScrollTrigger?: ScrollTriggerApi;
  }
}

export function LandingMotion() {
  const [coreReady, setCoreReady] = useState(false);
  const cleanupRef = useRef<(() => void) | null>(null);

  const setupMotion = useCallback(() => {
    cleanupRef.current?.();

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".aura-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".aura-scale").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0.4, scale: 0.9 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: "top 86%",
              end: "top 50%",
              scrub: 0.45,
            },
          },
        );
      });
    });

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const pin = ScrollTrigger.create({
        trigger: "#aura-proof-stage",
        start: "top top+=112",
        end: "bottom bottom-=96",
        pin: "#aura-proof-copy",
        pinSpacing: false,
      });

      return () => pin.kill();
    });

    cleanupRef.current = () => mm.revert();
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  return (
    <>
      <Script
        id="termbeacon-gsap-core"
        src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"
        strategy="afterInteractive"
        onLoad={() => setCoreReady(true)}
      />
      {coreReady ? (
        <Script
          id="termbeacon-gsap-scroll-trigger"
          src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/ScrollTrigger.min.js"
          strategy="afterInteractive"
          onLoad={setupMotion}
        />
      ) : null}
    </>
  );
}
