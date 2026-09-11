"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function isInViewport(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

export function RevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    els.forEach((el) => io.observe(el));

    // Belt-and-braces: content that loads/shifts asynchronously (images, iframes)
    // can settle into the viewport without the observer ever firing an initial
    // callback. Re-check geometry directly shortly after mount as a fallback.
    const recheck = () => {
      els.forEach((el) => {
        if (!el.classList.contains("in") && isInViewport(el)) {
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    };
    const timers = [100, 500, 1200].map((delay) => setTimeout(recheck, delay));

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [pathname]);

  return null;
}
