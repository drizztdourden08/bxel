/* @layer renderer-app @kind types */
import type { SegmentOption } from '@drizztdourden08/tessera';
import type { SpriteMode } from '../../stores/sprite-store.type';

interface ModeBarModel {
  mode: SpriteMode;
  options: SegmentOption<SpriteMode>[];
  isolated: boolean;
  broadcast: boolean;
  canBroadcast: boolean;
  count: number;
}

export type { ModeBarModel };
