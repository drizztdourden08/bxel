/* @layer renderer-app @kind types */
import type { Rect } from '@bxel/document';

interface PresenceLine {
  readonly id: number;
  readonly documentId: string;
  readonly text: string;
}

interface PresenceFlash {
  readonly id: number;
  readonly documentId: string;
  readonly spriteId: string;
  readonly frameId: string;
  readonly rect: Rect;
}

interface PresenceState {
  line: PresenceLine | null;
  flashes: readonly PresenceFlash[];
  show: (line: PresenceLine, flashes: readonly PresenceFlash[]) => void;
  endLine: (id: number) => void;
  endFlashes: (id: number) => void;
}

export type { PresenceFlash, PresenceLine, PresenceState };
