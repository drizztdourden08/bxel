/* @layer renderer-app @kind types */
import type { ShortcutKey, ToolbarSlot } from '@drizztdourden08/tessera';
import type { SpriteMode } from '../../stores/sprite-store.type';
import type { HintSpec } from '../ActionHint';

interface CanvasToolbarProps {
  slot: ToolbarSlot;
}

interface ModeModel {
  mode: SpriteMode;
  isolated: boolean;
  broadcast: boolean;
  canBroadcast: boolean;
  previewing: boolean;
  total: number;
  present: boolean;
}

interface TransformAction {
  id: string;
  hint: HintSpec;
  run: () => void;
}

type ModeKeys = Readonly<Record<SpriteMode, readonly ShortcutKey[] | undefined>>;

export type { CanvasToolbarProps, ModeKeys, ModeModel, TransformAction };
