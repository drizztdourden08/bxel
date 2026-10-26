/* @layer renderer-app @kind test */
import { decodeGif } from '@bxel/formats';
import { describe, expect, it } from 'vitest';
import type { PlannedFile } from '../../src/export/export.type';
import { planExport } from '../../src/export/plan-export';
import { walkWorld } from './animation-harness';
import type { WalkWorld } from './animation-harness';
import { bytesOf, frozenOf, settingsOf, textOf } from './export-harness';
import { expectGolden } from './golden';

const FACINGS = ['n', 'ne', 'e', 'se', 's', 'w', 'sw', 'nw'];

const planOf = (world: WalkWorld, patch: Parameters<typeof settingsOf>[0]) =>
  planExport({ frozen: frozenOf(world), settings: settingsOf({ animationId: world.animation, ...patch }), selectedIds: [] });

const fileNamed = (files: readonly PlannedFile[], name: string): PlannedFile => {
  const found = files.find((file) => file.name === name);
  if (!found) throw new Error(`no file ${name}`);
  return found;
};

const sheetOf = (world: WalkWorld, patch: Parameters<typeof settingsOf>[0]) => {
  const plan = planOf(world, { kind: 'sheet', layout: 'grid', columns: 4, padding: 1, ...patch });
  expect(plan.problem).toBeNull();
  return plan;
};

describe('animation GIF export', () => {
  it('writes one GIF for each facing', () => {
    const plan = planOf(walkWorld(), { kind: 'animation', animation: 'gif' });
    expect(plan.problem).toBeNull();
    expect(plan.files.map((file) => file.name)).toEqual(FACINGS.map((facing) => `walk_${facing}.gif`));
    for (const file of plan.files) expectGolden(`walk/${file.name}`, bytesOf(file));
  });

  it('expands a mirrored facing into real flipped frames', () => {
    const plan = planOf(walkWorld(), { kind: 'animation', animation: 'gif' });
    const east = decodeGif(bytesOf(fileNamed(plan.files, 'walk_e.gif')));
    const west = decodeGif(bytesOf(fileNamed(plan.files, 'walk_w.gif')));
    if (!east.ok || !west.ok) throw new Error('the GIF cannot be read');
    expect(west.frames).toHaveLength(2);
    expect(east.frames[0]?.data.some((value) => value !== 0)).toBe(true);
    expect(Array.from(east.frames[0]?.data ?? [])).not.toEqual(Array.from(west.frames[0]?.data ?? []));
    east.frames.forEach((frame, at) => {
      const flipped = west.frames[at];
      for (let y = 0; y < east.height; y += 1) {
        for (let x = 0; x < east.width; x += 1) {
          const from = (y * east.width + x) * 4;
          const to = (y * east.width + (east.width - 1 - x)) * 4;
          expect(Array.from(flipped?.data.slice(to, to + 4) ?? [])).toEqual(Array.from(frame.data.slice(from, from + 4)));
        }
      }
    });
  });

  it('exports one tag when asked and an APNG for each facing', () => {
    const world = walkWorld();
    const one = planOf(world, { kind: 'animation', frames: 'tag', tag: 'walk_s' });
    expect(one.files.map((file) => file.name)).toEqual(['walk_s.gif']);
    const png = planOf(world, { kind: 'animation', animation: 'apng' });
    expect(png.files).toHaveLength(8);
    expect(planOf(world, { kind: 'animation', frames: 'tag', tag: 'run' }).problem).toMatch(/no tag named run/u);
  });
});

describe('animation sheet export', () => {
  it('writes the Aseprite hash with a frame tag for each facing', () => {
    const plan = sheetOf(walkWorld(), { flavour: 'hash' });
    expect(plan.files.map((file) => file.name)).toEqual(['walk.png', 'walk.json']);
    const json = textOf(fileNamed(plan.files, 'walk.json'));
    expectGolden('walk/walk-hash.json', json);
    const meta = JSON.parse(json) as { meta: { frameTags: { name: string }[] } };
    expect(meta.meta.frameTags.map((tag) => tag.name)).toEqual(FACINGS.map((facing) => `walk_${facing}`));
  });

  it('writes the TexturePacker array with tag, facing and index names', () => {
    const plan = sheetOf(walkWorld(), { flavour: 'array' });
    const json = textOf(fileNamed(plan.files, 'walk.json'));
    expectGolden('walk/walk-array.json', json);
    const frames = (JSON.parse(json) as { frames: { filename: string }[] }).frames;
    expect(frames).toHaveLength(16);
    expect(frames.slice(0, 2).map((frame) => frame.filename)).toEqual(['walk_n_0', 'walk_n_1']);
    expect(frames.slice(10, 12).map((frame) => frame.filename)).toEqual(['walk_w_0', 'walk_w_1']);
  });

  it('merges identical frames by default and keeps them all with the switch off', () => {
    const world = walkWorld();
    const merged = sheetOf(world, { flavour: 'bxel' });
    const plain = sheetOf(world, { flavour: 'bxel', mergeFrames: false });
    type Parsed = {
      version: number;
      sprites: { frames: { frame: { x: number; y: number } }[]; tags: { name: string; facing?: string; mirrorOf?: string }[] }[];
    };
    const parse = (plan: ReturnType<typeof sheetOf>): Parsed => JSON.parse(textOf(fileNamed(plan.files, 'walk.json'))) as Parsed;
    const boxes = (plan: ReturnType<typeof sheetOf>): number =>
      new Set(parse(plan).sprites[0]?.frames.map((frame) => `${frame.frame.x},${frame.frame.y}`)).size;
    expect(boxes(plain)).toBe(16);
    expect(boxes(merged)).toBeLessThan(16);
    expect(parse(merged).version).toBe(2);
    const west = parse(merged).sprites[0]?.tags.find((tag) => tag.name === 'walk_w');
    expect([west?.facing, west?.mirrorOf]).toEqual(['w', 'walk_e']);
  });

  it('writes a Tiled tileset with one animation for each facing', () => {
    const plan = sheetOf(walkWorld(), { flavour: 'tiled', layout: 'packed', trim: true });
    expect(plan.files.map((file) => file.name)).toEqual(['walk.png', 'walk.tsj']);
    const tsj = JSON.parse(textOf(fileNamed(plan.files, 'walk.tsj'))) as { type: string; tiles: { animation: unknown[] }[] };
    expect(tsj.type).toBe('tileset');
    expect(tsj.tiles).toHaveLength(8);
    expect(tsj.tiles.every((tile) => tile.animation.length === 2)).toBe(true);
  });
});
