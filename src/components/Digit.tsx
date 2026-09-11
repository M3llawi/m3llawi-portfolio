"use client";

import { useEffect, useRef } from "react";

const CHARSET = "01#$%&*+=~?/<>ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const activeTimers = new WeakMap<HTMLSpanElement, ReturnType<typeof setInterval>>();

function decrypt(el: HTMLSpanElement, finalChar: string, duration: number, tick: number) {
  const running = activeTimers.get(el);
  if (running) clearInterval(running);

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    el.textContent = finalChar;
    return;
  }
  let elapsed = 0;
  el.classList.add("scrambling");
  const timer = setInterval(() => {
    elapsed += tick;
    if (elapsed >= duration) {
      el.textContent = finalChar;
      el.classList.remove("scrambling");
      clearInterval(timer);
      activeTimers.delete(el);
      return;
    }
    el.textContent = CHARSET[Math.floor(Math.random() * CHARSET.length)];
  }, tick);
  activeTimers.set(el, timer);
}

export function Digit({ id }: { id?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const initial = setTimeout(() => decrypt(el, "3", 1900, 70), 200);
    const onEnter = () => decrypt(el, "3", 1200, 65);
    el.addEventListener("mouseenter", onEnter);

    return () => {
      clearTimeout(initial);
      el.removeEventListener("mouseenter", onEnter);
      const running = activeTimers.get(el);
      if (running) clearInterval(running);
    };
  }, []);

  return (
    <span ref={ref} id={id} className="digit">
      3
    </span>
  );
}
