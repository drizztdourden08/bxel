/* @layer renderer-app @kind test */
import { ellipseMask, paintStroke } from '@bxel/raster';
import type { Brush, MaskView, Point, Symmetry } from '@bxel/raster';
import { describe, expect, it } from 'vitest';
import { createOverlay } from '../../src/editor/create-overlay';
import type { EditorTarget, StrokeSession } from '../../src/editor/editor.type';
import { extendStroke } from '../../src/editor/extend-stroke';
import { strokeRequest } from '../../src/editor/stroke-request';
import { openEditor } from './editor-harness';
import { walkPoints } from './walk-points';

const SIDE = 32;
const CHANNELS = 4;

interface Case {
  readonly name: string;
  readonly brush: Brush;
  readonly symmetry: Symmetry;
  readonly masked: boolean;
}

const CASES: readonly Case[] = [
  { name: 'a one pixel pen', brush: { shape: 'square', size: 1 }, symmetry: {}, masked: false },
  { name: 'a round brush of 3', brush: { shape: 'circle', size: 3 }, symmetry: {}, masked: false },
  { name: 'a square brush of 4 with both mirrors', brush: { shape: 'square', size: 4 }, symmetry: { x2: SIDE, y2: SIDE }, masked: false },
  { name: 'a one pixel pen with the x mirror', brush: { shape: 'square', size: 1 }, symmetry: { x2: SIDE - 1 }, masked: false },
  { name: 'a round brush of 5 inside a selection', brush: { shape: 'circle', size: 5 }, symmetry: {}, masked: true },
];

const sessionOf = (target: EditorTarget, spec: Case, mask: MaskView | null): StrokeSession => ({
  ...createOverlay(target),
  mask,
  kind: 'stroke',
  tool: 'pencil',
  index: 5,
  options: { brush: spec.brush, pixelPerfect: true, symmetry: spec.symmetry },
  points: [],
  trails: [],
});

const wholeStroke = (session: StrokeSession): Uint8Array => {
  const pixels = session.base.slice();
  const { brush, symmetry } = session.options;
  paintStroke({ target: { pixels, width: SIDE, height: SIDE }, index: session.index, points: session.points, brush, pixelPerfect: true, symmetry, mask: session.mask });
  return pixels;
};

const shownColours = (session: StrokeSession): Uint8ClampedArray => {
  const out = new Uint8ClampedArray(session.indices.length * CHANNELS);
  session.indices.forEach((slot, at) => out.set(session.table.subarray(slot * CHANNELS, slot * CHANNELS + CHANNELS), at * CHANNELS));
  return out;
};

describe('an incremental pixel perfect stroke', () => {
  for (const spec of CASES) {
    it(`matches painting the whole stroke again after every move, for ${spec.name}`, () => {
      const { target } = openEditor();
      const mask = spec.masked ? ellipseMask({ width: SIDE, height: SIDE }, { from: { x: 4, y: 3 }, to: { x: 27, y: 28 } }) : null;
      for (const seed of [11, 12, 13]) {
        const session = sessionOf(target(), spec, mask);
        const moves: Point[] = walkPoints(seed, 90, SIDE);
        for (const at of moves) {
          extendStroke(session, at);
          expect(session.indices).toEqual(wholeStroke(session));
        }
        expect(session.rgba).toEqual(shownColours(session));
      }
    });
  }

  it('commits the same pixels the overlay shows', () => {
    const { host, target, pixels } = openEditor();
    const [spec] = CASES;
    if (!spec) throw new Error('the cases are empty');
    const session = sessionOf(target(), spec, null);
    walkPoints(21, 60, SIDE).forEach((at) => extendStroke(session, at));
    expect(host.execute(strokeRequest(target(), session)).ok).toBe(true);
    expect(pixels()).toEqual(session.indices);
  });

  it('keeps the dirty rectangle around everything it changed', () => {
    const { target } = openEditor();
    const [spec] = CASES;
    if (!spec) throw new Error('the cases are empty');
    const session = sessionOf(target(), spec, null);
    walkPoints(31, 60, SIDE).forEach((at) => extendStroke(session, at));
    const rect = session.dirty;
    if (!rect) throw new Error('the stroke painted nothing');
    session.indices.forEach((slot, at) => {
      const x = at % SIDE;
      const y = Math.floor(at / SIDE);
      const inside = x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height;
      if (slot !== session.base[at]) expect(inside).toBe(true);
    });
  });
});
