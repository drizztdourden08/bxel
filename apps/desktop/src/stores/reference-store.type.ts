/* @layer renderer-app @kind types */
import type { RgbaPicture } from '@bxel/document';

type ReferenceEntry = { state: 'ready'; picture: RgbaPicture } | { state: 'missing' };

interface ReferenceState {
  entries: Readonly<Record<string, ReferenceEntry>>;
  settle: (path: string, entry: ReferenceEntry) => void;
  forget: (path: string) => void;
}

export type { ReferenceEntry, ReferenceState };
