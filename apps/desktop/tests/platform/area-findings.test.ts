/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { afterEach, describe, expect, it } from 'vitest';
import { focusArea } from '../../src/platform-preset/focus-area';
import { artworkReport } from '../../src/platform-preset/artwork-report';
import type { FindingLine } from '../../src/platform-preset/platform-preset.type';
import { useAreaStore } from '../../src/stores/useAreaStore';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { artworkOf, blank, chosen, platformFile, run, spriteScope } from './platform-harness';
import type { PlatformFile } from './platform-harness';

const COMBINED = { ...blank(), name: 'tiles', platformId: 'nes-bg', limit: 16, transparent: false, width: 32, height: 16, banks: 1 };

const paint = (file: PlatformFile, pick: (x: number) => number): void => {
  const sprite = artworkOf(file).sprites[0];
  const pixels = Uint8Array.from({ length: 32 * 16 }, (_unused, at) => pick(at % 32));
  const done = run(file, COMMAND_NAME.pixelsPatch, { rect: { x: 0, y: 0, width: 32, height: 16 }, pixels }, spriteScope(sprite?.id ?? ''));
  expect(done.ok).toBe(true);
};

const clashing = (x: number): number => {
  if (x < 8) return 1;
  return x < 16 ? 5 : 2;
};

const areaLines = (file: PlatformFile): FindingLine[] => (artworkReport(artworkOf(file))?.findings ?? []).filter((line) => line.area !== undefined);

afterEach(() => {
  useAreaStore.getState().clear();
});

describe('S2 area findings in the platform report', { tags: ['standard'] }, () => {
  it('lists a 16x16 area that uses two palettes, with the rectangle to highlight', () => {
    const file = platformFile(COMBINED);
    paint(file, clashing);
    const lines = areaLines(file);
    expect(lines).toHaveLength(1);
    expect(lines[0]?.tier).toBe('warn');
    expect(lines[0]?.text).toBe('tiles: 1 area uses more than one palette.');
    const frameId = artworkOf(file).sprites[0]?.frames[0]?.id ?? '';
    expect(lines[0]?.area?.frames[frameId]).toEqual([expect.objectContaining({ x: 0, y: 0, width: 16, height: 16, used: 2, limit: 1 })]);
  });

  it('finds nothing in a clean picture', () => {
    const file = platformFile(COMBINED);
    paint(file, (x) => (x < 16 ? 1 : 2));
    expect(areaLines(file)).toEqual([]);
  });

  it('follows an edit', () => {
    const file = platformFile(COMBINED);
    paint(file, clashing);
    expect(areaLines(file)).toHaveLength(1);
    paint(file, () => 6);
    expect(areaLines(file)).toEqual([]);
  });

  it('reports nothing for a platform without area rules', () => {
    const file = platformFile({ ...COMBINED, platformId: 'snes-sprite' });
    paint(file, clashing);
    expect(areaLines(file)).toEqual([]);
  });

  it('reports nothing when each palette is its own bank, because a sprite then has one palette', () => {
    const file = platformFile(chosen('nes-bg'));
    expect(artworkOf(file).banks).toHaveLength(4);
    expect(areaLines(file)).toEqual([]);
  });
});

describe('S2 selecting an area finding', { tags: ['standard'] }, () => {

  it('keeps a selection in step with the report and drops it when the finding is gone', () => {
    const file = platformFile(COMBINED);
    paint(file, clashing);
    const line = areaLines(file)[0];
    if (!line?.area) throw new Error('no area finding');
    useAreaStore.getState().toggle(line.area);
    expect(useAreaStore.getState().highlight?.key).toBe(line.area.key);
    useAreaStore.getState().sync([]);
    expect(useAreaStore.getState().highlight).toBeNull();
    useAreaStore.getState().sync([line.area]);
    expect(useAreaStore.getState().highlight).toBeNull();
  });

  it('makes the sprite of the clash the one on screen', () => {
    const file = platformFile(COMBINED);
    paint(file, clashing);
    const line = areaLines(file)[0];
    if (!line?.area) throw new Error('no area finding');
    useDocumentStore.getState().setActive(null);
    focusArea(line.area);
    expect(useSpriteStore.getState().activeId).toBe(line.area.spriteId);
  });
});
