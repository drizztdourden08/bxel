/* @layer renderer-app @kind constants */
import type { Artwork } from '@bxel/document';

const GHOSTS = new WeakMap<Artwork, Map<string, HTMLCanvasElement>>();

export { GHOSTS };
