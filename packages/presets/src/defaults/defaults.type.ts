/* @layer core @kind types */
import type { Slot0Policy } from '../model/preset.type';
import type { SpriteSize } from '../model/sprite-size.type';

type PresetSlot =
  | { readonly kind: 'transparent' }
  | { readonly kind: 'color'; readonly rgb: string };

type PresetDefaults = {
  readonly presetId: string;
  readonly bankCount: number;
  readonly bankSize: number;
  readonly slot0: Slot0Policy;
  readonly transparent: boolean;
  readonly slot0Shared: boolean;
  readonly palette: readonly PresetSlot[];
  readonly spriteSize: SpriteSize;
  readonly tileSize: SpriteSize | null;
};

export type { PresetDefaults, PresetSlot };
