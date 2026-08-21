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
  to: (target: Element, vars: AnimationVars) => unknown;
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
      gsap.utils.toArray<HTMLElement>(".js-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 88%",
              once: true,
            },
          },
        );
      });
    });

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const pin = ScrollTrigger.create({
        trigger: "#proof-stage",
        start: "top top+=96",
        end: "bottom bottom-=72",
        pin: "#proof-copy",
        pinSpacing: false,
      });

      const cards = gsap.utils.toArray<HTMLElement>(".js-stack-card");
      cards.forEach((card, index) => {
        gsap.fromTo(
          card,
          { opacity: 0.72, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 78%",
              end: "top 54%",
              scrub: 0.35,
            },
          },
        );

        const nextCard = cards[index + 1];
        if (nextCard) {
          gsap.to(card, {
            opacity: 0.58,
            scale: 0.975,
            scrollTrigger: {
              trigger: nextCard,
              start: "top 72%",
              end: "top 48%",
              scrub: 0.35,
            },
          });
        }
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
