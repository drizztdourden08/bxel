/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { IDLE_TIMEOUT_MS, SETTLE_MS, THUMB_CACHE_MAX } from './asset-thumbs.constants';
import type { ThumbEntry, ThumbRequest, ThumbStore } from './asset-thumbs.type';

const entries = new Map<string, ThumbEntry>();
const pending = new Map<string, ThumbRequest>();
const listeners = new Set<() => void>();
let current: Artwork | undefined;
let draining = false;

const notify = (): void => {
  for (const listener of listeners) listener();
};

const put = (key: string, entry: ThumbEntry): void => {
  entries.delete(key);
  entries.set(key, entry);
  for (const oldest of entries.keys()) {
    if (entries.size <= THUMB_CACHE_MAX) break;
    entries.delete(oldest);
  }
  notify();
};

const idle = (): Promise<void> =>
  new Promise((resolve) => {
    if (typeof requestIdleCallback === 'function') requestIdleCallback(() => resolve(), { timeout: IDLE_TIMEOUT_MS });
    else setTimeout(resolve, 0);
  });

const run = async (request: ThumbRequest): Promise<void> => {
  const url = await Promise.resolve()
    .then(request.job)
    .catch(() => null);
  put(request.key, { signature: request.signature, url, settled: true });
};

const drain = async (): Promise<void> => {
  if (draining) return;
  draining = true;
  await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
  for (let next = pending.values().next(); next.done !== true; next = pending.values().next()) {
    pending.delete(next.value.key);
    await idle();
    await run(next.value);
  }
  draining = false;
};

const thumbStore: ThumbStore = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  read: (key) => entries.get(key),
  artwork: () => current,
  setArtwork: (artwork) => {
    if (artwork === current) return;
    current = artwork;
    notify();
  },
  request: (request) => {
    const known = entries.get(request.key);
    if (known?.signature === request.signature || pending.get(request.key)?.signature === request.signature) return;
    pending.set(request.key, request);
    if (known === undefined) put(request.key, { signature: request.signature, url: null, settled: false });
    void drain();
  },
};

export { thumbStore };
