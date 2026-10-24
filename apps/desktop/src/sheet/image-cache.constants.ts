/* @layer renderer-app @kind constants */
import type { PaletteBank, Sprite } from '@bxel/document';
import type { FrameImage } from './sheet.type';

const IMAGE_CACHE = new WeakMap<Sprite, WeakMap<PaletteBank, FrameImage | null>>();

export { IMAGE_CACHE };
