import { useSyncExternalStore } from "react";

const query = window.matchMedia("(min-width: 1024px)");
const subscribe = (notify: () => void) => {
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};
export const useWide = () => useSyncExternalStore(subscribe, () => query.matches);
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const subscribeMotion = (notify: () => void) => {
  reduced.addEventListener("change", notify);
  return () => reduced.removeEventListener("change", notify);
};
export const useReducedMotion = () => useSyncExternalStore(subscribeMotion, () => reduced.matches);
