/* @layer renderer-app @kind logic */
import type { PaintSession } from './editor.type';

type Listener = () => void;

const listeners = new Set<Listener>();

let session: PaintSession | null = null;
let tick = 0;

const changed = (): void => {
  tick += 1;
  for (const listener of listeners) listener();
};

/** The stroke or shape that is being drawn right now, so a panel can show it before it is committed. */
const livePaint = (): PaintSession | null => session;

/** Counts every change of the live stroke, for useSyncExternalStore. */
const livePaintTick = (): number => tick;

const startLivePaint = (started: PaintSession): void => {
  session = started;
  changed();
};

const updateLivePaint = (): void => {
  if (session) changed();
};

const endLivePaint = (): void => {
  session = null;
  changed();
};

const subscribeLivePaint = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export { endLivePaint, livePaint, livePaintTick, startLivePaint, subscribeLivePaint, updateLivePaint };
