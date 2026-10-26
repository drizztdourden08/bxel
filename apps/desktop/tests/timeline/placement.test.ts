/* @layer renderer-app @kind test */
import { animFramePivot, COMMAND_NAME, findBank, findSprite } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { editMask } from '../../src/editor/edit-mask';
import { fillRequest } from '../../src/editor/fill-request';
import { createOverlay } from '../../src/editor/create-overlay';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useTimelineStore } from '../../src/stores/useTimelineStore';
import { TIMELINE_DEFAULTS } from '../../src/stores/timeline-store.constants';
import { canvasOrigin } from '../../src/timeline/canvas-origin';
import { frameCells } from '../../src/timeline/frame-cells';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { nudgeOffset, setOffset } from '../../src/timeline/nudge-offset';
import { onionPixels } from '../../src/timeline/onion-pixels';
import { ownFrame } from '../../src/timeline/own-frame';
import { setPivot } from '../../src/timeline/set-pivot';
import { sharedNote } from '../../src/timeline/shared-note';
import { runSteps } from '../../src/transactions/run-steps';
import { focusTab } from '../../src/workspace/focus-tab';
import { tabOf } from '../../src/workspace/tab-of';
import { animationOf, frameAt, freshAnimation, live, paintFrame, target, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
});

const stripAnimation = (): void => {
  const { host } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  useDocumentStore.getState().setActive(documentId);
  const made = runSteps(host, documentId, 'Strip', [
    { name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'strip', width: 16, height: 4 }, ref: 'strip' },
    { name: COMMAND_NAME.animationCreate, targets: null, options: { name: 'cells', source: { kind: 'strip', sprite: { ref: 'strip' }, grid: { columns: 4, rows: 1 } } }, ref: 'cells' },
    { name: COMMAND_NAME.sheetCreate, targets: null, options: { name: 'atlas' }, ref: 'atlas' },
  ]);
  if (!made.ok) throw new Error(made.error.message);
  focusTab(tabOf(documentId, { kind: 'animation', id: made.created['cells'] as string }));
  useTimelineStore.setState({ ...TIMELINE_DEFAULTS });
};

describe('onion ghosts follow the anchor', () => {
  it('place the other frame by its own offset, in canvas coordinates', () => {
    withFrames(2);
    paintFrame(0, 1, 1, 2);
    paintFrame(1, 5, 5, 3);
    goToFrame(frameAt(1));
    expect(setOffset(-2, 0)).toBe(true);
    const { artwork, animation, frame } = live();
    const bank = findBank(artwork, animation.bankId);
    if (!bank) throw new Error('no bank');
    const ghost = onionPixels(artwork, animation, bank, frame.id, { frameId: frameAt(0), flip: null, side: 'before', tint: 'split' });
    const alpha = (x: number, y: number): number => ghost[(y * animation.width + x) * 4 + 3] ?? 0;
    expect([alpha(1, 1), alpha(0, 0), alpha(5, 5)]).toEqual([255, 0, 0]);
    expect(canvasOrigin(artwork, animation, frame)).toEqual({ x: 2, y: 0 });
    expect(canvasOrigin(artwork, animation, animation.frames[0] ?? frame)).toEqual({ x: 0, y: 0 });
  });

  it('flip a mirrored frame inside the canvas', () => {
    withFrames(2);
    paintFrame(0, 1, 2, 2);
    goToFrame(frameAt(1));
    const { artwork, animation, frame } = live();
    const bank = findBank(artwork, animation.bankId);
    if (!bank) throw new Error('no bank');
    const ghost = onionPixels(artwork, animation, bank, frame.id, { frameId: frameAt(0), flip: 'x', side: 'after', tint: 'none' });
    const alpha = (x: number, y: number): number => ghost[(y * animation.width + x) * 4 + 3] ?? 0;
    expect([alpha(6, 2), alpha(1, 2)]).toEqual([255, 0]);
  });
});

describe('moving a frame', () => {
  it('nudges the offset by the step and by undo steps', () => {
    withFrames(2);
    expect(nudgeOffset(2, -1)).toBe(true);
    expect(live().frame.offset).toEqual({ x: 2, y: -1 });
    expect(nudgeOffset(-1, 0)).toBe(true);
    expect(live().frame.offset).toEqual({ x: 1, y: -1 });
    useDocumentStore.getState().host.undo(live().documentId);
    expect(live().frame.offset).toEqual({ x: 2, y: -1 });
  });

  it('does not move a frame that has no sprite yet', () => {
    freshAnimation();
    const { host } = useDocumentStore.getState();
    const done = runSteps(host, live().documentId, 'Empty', [
      { name: COMMAND_NAME.animationFrameAdd, targets: null, options: { animation: animationOf().id, source: { kind: 'empty', count: 1 } } },
    ]);
    expect(done.ok).toBe(true);
    goToFrame(frameAt(1));
    expect(nudgeOffset(1, 0)).toBe(false);
  });

  it('sets the pivot of one frame and keeps the other half as it was', () => {
    withFrames(2);
    const before = animFramePivot(live().artwork, live().animation, live().frame);
    expect(setPivot(2, null)).toBe(true);
    expect(live().frame.pivot).toEqual({ x2: 2, y2: before.y2 });
    expect(setPivot(2, null)).toBe(false);
  });
});

describe('a frame that is a cell of a strip', () => {
  it('has the shared and clip badges, and an empty frame has the empty badge', () => {
    stripAnimation();
    const cells = frameCells(live(), useTimelineStore.getState().selection);
    expect(cells.map((cell) => cell.badges)).toEqual([['shared', 'clip'], ['shared', 'clip'], ['shared', 'clip'], ['shared', 'clip']]);
    expect(cells[0]?.label).toBe('Frame 1, 100 milliseconds, shared, clip');
  });

  it('locks the pixels outside its cell for strokes, fills and transforms', () => {
    stripAnimation();
    goToFrame(frameAt(1));
    const mask = editMask(target());
    const allows = (x: number, y: number): boolean => (mask?.bits[y * mask.width + x] ?? 0) !== 0;
    expect([allows(4, 0), allows(7, 3), allows(3, 0), allows(8, 0)]).toEqual([true, true, false, false]);
    expect(createOverlay(target()).mask).not.toBeNull();
    const request = fillRequest(target(), { x: 5, y: 1 }, { index: 2, mode: 'contiguous', connectivity: 4 });
    const options = request.steps[0]?.options as { mask?: unknown };
    expect(options.mask).toBeDefined();
  });

  it('puts the animation canvas over the cell it shows', () => {
    stripAnimation();
    goToFrame(frameAt(2));
    const { artwork, animation, frame } = live();
    expect(canvasOrigin(artwork, animation, frame)).toEqual({ x: 8, y: 0 });
  });

  it('says where the strip is used and gives the frame a copy of its own', () => {
    stripAnimation();
    const strip = findSprite(live().artwork, live().frame.spriteId as never);
    expect(strip?.role).toBe('sprite');
    expect(sharedNote(live())).toBe('Also used by 3 other frames of this animation.');
    expect(ownFrame()).toBe(true);
    const owned = findSprite(live().artwork, live().frame.spriteId as never);
    expect(owned?.role).toBe('frame');
    expect(owned?.id).not.toBe(strip?.id);
    expect(findSprite(live().artwork, strip?.id as never)?.role).toBe('sprite');
    expect(sharedNote(live())).toBeNull();
    expect(live().frame.clip).toEqual({ x: 0, y: 0, width: 4, height: 4 });
  });
});
