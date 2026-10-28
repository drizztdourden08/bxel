/* @layer helper @kind types */
import type { Grant } from '@bxel/mcp';

type GrantTracker = {
  readonly current: () => Grant | null;
  readonly sessionId: () => string | null;
  readonly accept: (sessionId: string, grant: Grant) => void;
  readonly follow: (sessionId: string, grant: Grant) => void;
  readonly onChange: (listener: () => void) => void;
};

export type { GrantTracker };
