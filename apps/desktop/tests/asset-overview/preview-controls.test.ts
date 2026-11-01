/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import type { PreviewFrame, PreviewTag } from '../../src/asset-overview/asset-overview.type';
import { flipLayers } from '../../src/asset-overview/flip-layers';
import { tagFrames } from '../../src/asset-overview/tag-frames';
import { tilemapLayers } from '../../src/asset-overview/tilemap-layers';
import { mapArtwork } from '../project/map-artwork';

const frame = (id: string): PreviewFrame => ({ id, durationMs: 100, image: { data: new Uint8ClampedArray(4), width: 1, height: 1 } });

const FRAMES: readonly PreviewFrame[] = ['a', 'b', 'c', 'd'].map(frame);

const TAG: PreviewTag = { id: 'run', name: 'run', from: 1, to: 2, direction: 'pingpong', repeat: 3 };

describe('S2 preview controls', { tags: ['standard'] }, () => {
  it('slices the frames of an animation to the span of the picked tag', () => {
    expect(tagFrames(FRAMES, TAG).map((each) => each.id)).toEqual(['b', 'c']);
  });

  it('keeps every frame when no tag is picked', () => {
    expect(tagFrames(FRAMES, undefined)).toBe(FRAMES);
  });

  it('lists the layers of a tilemap with their visibility', () => {
    const artwork = mapArtwork();
    const level = artwork.tilemaps.find((each) => each.name === 'level');
    const layers = tilemapLayers(artwork, level?.id ?? '');
    expect(layers.length).toBeGreaterThan(0);
    expect(layers.every((layer) => layer.visible)).toBe(true);
  });

  it('flips the visibility of the picked layers of one tilemap only', () => {
    const artwork = mapArtwork();
    const level = artwork.tilemaps.find((each) => each.name === 'level');
    const vault = artwork.tilemaps.find((each) => each.name === 'vault');
    const first = level?.layers[0];
    if (!level || !vault || !first) throw new Error('the fixture has no maps');
    const flipped = flipLayers(artwork, level.id, new Set([first.id]));
    expect(flipped.tilemaps.find((each) => each.id === level.id)?.layers[0]?.visible).toBe(false);
    expect(flipped.tilemaps.find((each) => each.id === vault.id)).toBe(vault);
    expect(artwork.tilemaps.find((each) => each.id === level.id)?.layers[0]?.visible).toBe(true);
  });

  it('returns the same artwork when nothing is flipped', () => {
    const artwork = mapArtwork();
    expect(flipLayers(artwork, artwork.tilemaps[0]?.id ?? '', new Set())).toBe(artwork);
  });
});
