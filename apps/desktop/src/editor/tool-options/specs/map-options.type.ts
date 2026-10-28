/* @layer renderer-app @kind types */
import type { CellFlags } from '@bxel/document';
import type { FlagOp } from '../../../tilemap/tilemap.type';
import type { OptionSpec } from '../tool-options.type';

interface TurnSpec {
  op: FlagOp;
  flag: keyof CellFlags;
  name: string;
  label: string;
  description: string;
  icon: 'pixel-flip-tile-x' | 'pixel-flip-tile-y' | 'pixel-turn-right';
  command: string;
  priority: number;
}

interface CellAction {
  name: string;
  label: string;
  description: string;
  icon: OptionSpec['icon'];
  command: string;
  priority: number;
  run: () => unknown;
}

export type { CellAction, TurnSpec };
