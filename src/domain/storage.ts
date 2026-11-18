export function readValue<T>(
  storage: Pick<Storage, "getItem">,
  key: string,
  fallback: T,
  valid: (value: unknown) => value is T,
): T {
  try {
    const raw: unknown = JSON.parse(storage.getItem(key) ?? "null");
    return valid(raw) ? raw : fallback;
  } catch {
    return fallback;
  }
}

export function writeValue(
  storage: Pick<Storage, "setItem">,
  key: string,
  value: unknown,
): boolean {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export const isText = (v: unknown): v is string => typeof v === "string";
