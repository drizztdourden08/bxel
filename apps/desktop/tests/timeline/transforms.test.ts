/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Sprite, SpriteId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { NO_CURRENT } from '../../src/editor/current-pick.constants';
import { DIRECTION_START } from '../../src/direction-set/direction-set.constants';
import { drawFacing } from '../../src/direction-set/draw-facing';
import { runDirectionSet } from '../../src/direction-set/run-direction-set';
import { DEFAULT_EXPORT_SETTINGS } from '../../src/export/export.constants';
import { planExport } from '../../src/export/plan-export';
import { makeSpritesheet } from '../../src/timeline/make-spritesheet';
import { splitToSprites } from '../../src/timeline/split-to-sprites';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { animationOf, freshAnimation, live, run, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const sheetNamed = (name: string) => {
  const { host, activeId } = useDocumentStore.getState();
  return activeId === null ? undefined : host.view(activeId)?.state.artwork.sheets.find((sheet) => sheet.name === name);
};

const roleOf = (sprites: readonly Sprite[], id: string | null): string | undefined => sprites.find((sprite) => sprite.id === id)?.role;

const EIGHT = { ...DIRECTION_START, mode: 'eight' as const, framesPerFacing: 2, mirrored: ['nw', 'w', 'sw'] as const };

describe('a new direction set', () => {
  it('scaffolds a tag for each facing, three of them mirrors, and picks the first facing', () => {
    expect(runDirectionSet({ ...EIGHT, mirrored: [...EIGHT.mirrored] })).toBe(true);
    const animation = animationOf();
    expect(animation.directions).toBe('eight');
    expect(animation.tags.map((tag) => tag.facing).sort()).toEqual(['e', 'n', 'ne', 'nw', 's', 'se', 'sw', 'w']);
    expect(animation.tags.filter((tag) => tag.kind === 'mirror')).toHaveLength(3);
    expect(animation.frames).toHaveLength(10);
    expect(useTimelineStore.getState().tagId).toBe(animation.tags.find((tag) => tag.facing === 'n')?.id);
  });

  it('draws a mirrored facing as frames of its own and refuses to draw one that is drawn', () => {
    runDirectionSet({ ...EIGHT, mirrored: [...EIGHT.mirrored] });
    expect(drawFacing('w')).toBe(true);
    const animation = animationOf();
    expect(animation.frames).toHaveLength(12);
    expect(animation.tags.filter((tag) => tag.kind === 'mirror').map((tag) => tag.facing)).toEqual(['nw', 'sw']);
    expect(drawFacing('w')).toBe(false);
  });
});

describe('splitting to sprites', () => {
  it('cuts every clipped frame into a sprite of its own and promotes owned frames', () => {
    withFrames(3);
    const done = run('Strip', [
      { name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'strip', width: 16, height: 8 }, ref: 'strip' },
      { name: COMMAND_NAME.animationFrameAdd, targets: null, options: { animation: live().animation.id, source: { kind: 'strip', sprite: { ref: 'strip' }, grid: { columns: 2, rows: 1 } }, at: 3 } },
    ]);
    expect(done.created['strip']).toBeDefined();
    useTimelineStore.getState().select({ frames: animationOf().frames.slice(3).map((frame) => frame.id), anchor: null }, animationOf().frames[3]?.id ?? live().frame.id);
    expect(splitToSprites()).toBe(2);
    const frames = animationOf().frames.slice(3);
    expect(frames.every((frame) => frame.clip === null)).toBe(true);
    const sprites = live().artwork.sprites;
    expect(frames.map((frame) => roleOf(sprites, frame.spriteId))).toEqual(['sprite', 'sprite']);
  });
});

describe('making a spritesheet', () => {
  it('places the whole animation as one live entry', async () => {
    withFrames(2);
    const { id } = animationOf();
    await makeSpritesheet();
    expect(sheetNamed('walk sheet')?.animationEntries).toEqual([{ animationId: id, tagId: null, at: { x: 0, y: 0 } }]);
  });

  it('places one row for each tag when directions are set', async () => {
    runDirectionSet({ ...EIGHT, mirrored: [...EIGHT.mirrored] });
    const { tags, height } = animationOf();
    await makeSpritesheet();
    const entries = sheetNamed('walk sheet')?.animationEntries ?? [];
    expect(entries.map((entry) => entry.tagId)).toEqual(tags.map((tag) => tag.id));
    expect(entries.map((entry) => entry.at.y)).toEqual(entries.map((_entry, row) => row * height));
  });
});

describe('exporting the frames as images', () => {
  it('plans one numbered PNG for each frame of the animation', () => {
    withFrames(3);
    const { artwork, animation } = live();
    const settings = { ...DEFAULT_EXPORT_SETTINGS, kind: 'frames' as const, animationId: animation.id, scale: 2 };
    const plan = planExport({ frozen: { revision: 1, artwork }, settings, selectedIds: [] as SpriteId[], current: NO_CURRENT });
    expect(plan.problem).toBeNull();
    expect(plan.files.map((file) => file.name)).toEqual(['walk_01.png', 'walk_02.png', 'walk_03.png']);
    expect(plan.files.every((file) => file.width === 16 && file.height === 16)).toBe(true);
    const made = plan.files[0]?.make();
    expect(made?.ok).toBe(true);
  });
});
