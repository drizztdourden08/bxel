/* @layer renderer-app @kind types */
import type { SpriteMode } from '../../stores/sprite-store.type';
import type { HintedOption } from '../ActionHint';

interface ModeBarModel {
  mode: SpriteMode;
  options: HintedOption<SpriteMode>[];
  isolated: boolean;
  broadcast: boolean;
  canBroadcast: boolean;
  count: number;
}

export type { ModeBarModel };
