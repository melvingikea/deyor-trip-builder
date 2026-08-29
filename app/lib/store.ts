import type { Itinerary } from "./itinerary";

/**
 * KV-backed itinerary store.
 * Uses cloudflare:workers env in production, in-memory Map in local dev.
 */

// Dev fallback
const devStore = new Map<string, string>();

let _env: { ITINERARIES?: KVNamespace } | null = null;

async function getKV(): Promise<KVNamespace | null> {
  if (_env) return _env.ITINERARIES ?? null;
  try {
    const mod = await import("cloudflare:workers");
    _env = mod.env;
    return _env?.ITINERARIES ?? null;
  } catch {
    _env = {};
    return null;
  }
}

export async function saveItinerary(itinerary: Itinerary): Promise<void> {
  const kv = await getKV();
  const json = JSON.stringify(itinerary);
  if (kv) {
    await kv.put(itinerary.id, json, { expirationTtl: 60 * 60 * 24 * 7 });
  } else {
    devStore.set(itinerary.id, json);
  }
}

export async function getItinerary(id: string): Promise<Itinerary | null> {
  const kv = await getKV();
  const raw = kv ? await kv.get(id) : devStore.get(id) ?? null;
  if (!raw) return null;
  return JSON.parse(raw) as Itinerary;
}
