/* @layer renderer-app @kind types */
import type { SpriteId } from '@bxel/document';

interface DeleteImpact {
  id: SpriteId;
  name: string;
  sheets: number;
  tilemaps: number;
}

interface DeletePlan {
  impacts: readonly DeleteImpact[];
  used: number;
  blocker: string | null;
}

export type { DeleteImpact, DeletePlan };
