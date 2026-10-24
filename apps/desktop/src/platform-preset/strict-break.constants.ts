/* @layer renderer-app @kind constants */
import type { Artwork } from '@bxel/document';
import type { RuleFinding } from '@bxel/presets';

const FINDINGS_CACHE = new WeakMap<Artwork, Map<string, readonly RuleFinding[]>>();

export { FINDINGS_CACHE };
