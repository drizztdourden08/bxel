/* @layer renderer-app @kind types */
import type { TagId } from '@bxel/document';

interface AnimationPlacement {
  tagId: TagId | null;
  at: { x: number; y: number };
  onSheet: boolean;
}

export type { AnimationPlacement };
