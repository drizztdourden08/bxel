/* @layer renderer-app @kind constants */
import type { PaletteBank, Sprite } from '@bxel/document';

const GHOSTS = new WeakMap<PaletteBank, WeakMap<Sprite, Map<string, HTMLCanvasElement>>>();

export { GHOSTS };
