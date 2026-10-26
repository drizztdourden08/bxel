/* @layer renderer-app @kind test */
import { COMMAND_NAME, findSprite } from '@bxel/document';
import type { Sheet, SpriteId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { DURATION_START, STRIP_START } from '../../src/add-frames/add-frames.constants';
import type { AddRequest } from '../../src/add-frames/add-frames.type';
import { dropSprite } from '../../src/add-frames/drop-sprite';
import { eligibleSheets } from '../../src/add-frames/eligible-sheets';
import { eligibleSprites } from '../../src/add-frames/eligible-sprites';
import { runAddFrames } from '../../src/add-frames/run-add-frames';
import { stripPlan } from '../../src/add-frames/strip-plan';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { insertAt } from '../../src/timeline/insert-at';
import { animationOf, frameAt, freshAnimation, live, run, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const make = (names: readonly string[], size = 8): SpriteId[] => {
  const done = run(
    'Sprites',
    names.map((name) => ({ name: COMMAND_NAME.spriteCreate, targets: null, options: { name, width: size, height: size }, ref: name })),
  );
  return names.map((name) => done.created[name] as SpriteId);
};

const spriteIds = (): (string | null)[] => animationOf().frames.map((frame) => frame.spriteId);

const request = (extra: Omit<Extract<AddRequest, { kind: 'sprites' }>, 'at' | 'durationMs'>): AddRequest => ({ ...extra, at: insertAt(live()), durationMs: 80 });

describe('adding frames from sprites', () => {
  it('lists only still sprites of the same palette and adds them by reference after the current frame', () => {
    withFrames(2);
    const [a, b] = make(['a', 'b']);
    const { sprites } = eligibleSprites(live().artwork, live().animation);
    expect(sprites.map((sprite) => sprite.name)).toEqual(expect.arrayContaining(['a', 'b']));
    expect(sprites.every((sprite) => sprite.role === 'sprite')).toBe(true);
    expect(runAddFrames(request({ kind: 'sprites', sprites: [a as SpriteId, b as SpriteId], mode: 'reference' }))).toBe(true);
    expect(spriteIds().slice(1, 3)).toEqual([a, b]);
    expect(animationOf().frames.slice(1, 3).map((frame) => frame.durationMs)).toEqual([80, 80]);
    expect(useTimelineStore.getState().selection.frames).toEqual([frameAt(1), frameAt(2)]);
  });

  it('adds copies the animation owns, in one undo step', () => {
    withFrames(1);
    const [a] = make(['a']);
    const before = spriteIds();
    expect(runAddFrames(request({ kind: 'sprites', sprites: [a as SpriteId], mode: 'copy' }))).toBe(true);
    const added = findSprite(live().artwork, spriteIds()[1] as never);
    expect(added?.role).toBe('frame');
    expect(added?.id).not.toBe(a);
    useDocumentStore.getState().host.undo(live().documentId);
    expect(spriteIds()).toEqual(before);
  });
});

describe('adding frames from a strip', () => {
  const spec = { ...STRIP_START, columns: 4, rows: 4 };

  it('plans the cells and says why a strip cannot be cut', () => {
    const [strip] = make(['strip'], 32);
    const sprite = findSprite(live().artwork, strip as SpriteId) ?? null;
    expect(stripPlan(sprite, spec).cells).toHaveLength(16);
    expect(stripPlan(sprite, { ...spec, by: 'size', cellWidth: 64, cellHeight: 8 }).error).toContain('does not fit');
    expect(stripPlan(sprite, { ...spec, columns: 3 }).error).toContain('does not divide');
  });

  it('uses the cells as clips of the strip sprite', () => {
    const [strip] = make(['strip'], 32);
    expect(runAddFrames({ kind: 'strip', sprite: strip as SpriteId, spec, cells: 16, result: 'cells', durationMs: DURATION_START, at: 1 })).toBe(true);
    const added = animationOf().frames.slice(1);
    expect(added).toHaveLength(16);
    expect(added.every((frame) => frame.spriteId === strip && frame.clip?.width === 8)).toBe(true);
  });

  it('cuts the cells into sprites of their own in the same undo step', () => {
    const [strip] = make(['strip'], 32);
    const before = live().artwork.sprites.length;
    const stills = live().artwork.sprites.filter((sprite) => sprite.role === 'sprite').length;
    expect(runAddFrames({ kind: 'strip', sprite: strip as SpriteId, spec, cells: 16, result: 'cut', durationMs: DURATION_START, at: 1 })).toBe(true);
    const added = animationOf().frames.slice(1);
    expect(added.every((frame) => frame.clip === null && frame.spriteId !== strip)).toBe(true);
    expect(live().artwork.sprites.filter((sprite) => sprite.role === 'sprite')).toHaveLength(stills + 16);
    useDocumentStore.getState().host.undo(live().documentId);
    expect(animationOf().frames).toHaveLength(1);
    expect(live().artwork.sprites).toHaveLength(before);
  });
});

describe('adding frames from a sheet and by dropping', () => {
  it('adds the sprites of a sheet in the order of the sheet', () => {
    const [a, b] = make(['a', 'b']);
    const done = run('Sheet', [
      { name: COMMAND_NAME.sheetCreate, targets: null, options: { name: 'party' }, ref: 'party' },
      { name: COMMAND_NAME.sheetAdd, targets: { sprites: [b as SpriteId, a as SpriteId], layers: { by: 'all' }, frames: { by: 'all' } }, options: { sheet: { ref: 'party' } } },
    ]);
    const sheet = live().artwork.sheets.find((each) => each.id === done.created['party']) as Sheet;
    expect(eligibleSheets(live().artwork, live().animation).map((each) => each.name)).toContain('party');
    expect(runAddFrames({ kind: 'sheet', sheet: sheet.id, mode: 'reference', durationMs: 100, at: 1 })).toBe(true);
    expect(spriteIds().slice(1)).toEqual([b, a]);
  });

  it('adds a dropped sprite at the position and refuses a sprite the animation cannot hold', () => {
    withFrames(3);
    goToFrame(frameAt(0));
    const [a] = make(['a']);
    expect(dropSprite(a as string, 1, false)).toBe(true);
    expect(spriteIds()[1]).toBe(a);
    const owned = animationOf().frames[0]?.spriteId ?? '';
    expect(dropSprite(owned, 0, false)).toBe(false);
    expect(animationOf().frames).toHaveLength(4);
  });
});
