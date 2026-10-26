/* @layer renderer-app @kind types */
import type { SpriteMode } from '../../stores/sprite-store.type';

interface StageBodyProps {
  adding: boolean;
  mode: SpriteMode;
  placing: boolean;
}

export type { StageBodyProps };
