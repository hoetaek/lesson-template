import { createContext, useContext } from "react";
import { readValue, writeValue } from "../domain/storage";

const tabValues = new Map<string, unknown>();

export const LessonContext = createContext("");
export const MotionContext = createContext(1);
export const useProgress = () => useContext(MotionContext);
export const useStorageKey = (id: string) => `${useContext(LessonContext)}:${id}`;

export function load<T>(key: string, fallback: T, valid: (v: unknown) => v is T): T {
  const value = tabValues.get(key);
  const current = valid(value) ? value : fallback;
  try {
    return readValue(window.localStorage, key, current, valid);
  } catch {
    return current;
  }
}
export function save(key: string, value: unknown): void {
  tabValues.set(key, value);
  let okay = false;
  try {
    okay = writeValue(window.localStorage, key, value);
  } catch {
    /* 현재 탭의 상태는 남긴다. */
  }
  if (!okay) window.dispatchEvent(new Event("lesson-storage-failed"));
}
