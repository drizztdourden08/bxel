/* @layer renderer-app @kind types */
import type { SpriteSettings } from '../stores/sprite-store.type';

interface SpriteFlags extends Pick<SpriteSettings, 'isolated' | 'broadcast' | 'spritesScope' | 'layerScope'> {
  mode: SpriteSettings['mode'];
  selected: number;
}

export type { SpriteFlags };
