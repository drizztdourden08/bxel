/* @layer renderer-app @kind test */
import type { Artwork } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { alphaLimit } from '../../src/palette-panel/alpha-limit';

const artwork = (platformId: string | undefined, strict: boolean): Artwork => ({ platformId, platformStrict: strict }) as unknown as Artwork;

describe('W8b the Opaque switch', { tags: ['critical'] }, () => {
  it('limits alpha to a switch under a strict console preset', () => {
    const limit = alphaLimit(artwork('snes-sprite', true), null);
    expect(limit.binary).toBe(true);
    expect(limit.reason).not.toBe('');
  });

  it('keeps the slider for a generic preset, a loose preset or no preset', () => {
    expect(alphaLimit(artwork('generic-16', true), null).binary).toBe(false);
    expect(alphaLimit(artwork('snes-sprite', false), null).binary).toBe(false);
    expect(alphaLimit(artwork(undefined, false), null).binary).toBe(false);
  });
});
