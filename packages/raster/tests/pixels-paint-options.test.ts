/* @layer tests @kind test */
import type { SpriteId } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { brand } from './brand';
import { buildProject } from './build-project';
import { maskFromRows } from './mask-from-rows';
import { pixelEngine, request, scopeOf, stepOf } from './pixel-engine';
import { celRows, errorOf, okOf } from './result-checks';
import { emptyProject, rowsIds } from './rows-project';

const SCOPE = scopeOf([rowsIds.sprite]);

const paint = (options: Record<string, unknown>) => request([stepOf('pixels.paint', SCOPE, { index: 1, ...options })]);

describe('pixels.paint options', () => {
  test('clips a stroke that starts outside the sprite and creates the missing cel', () => {
    const engine = pixelEngine(emptyProject(4, 4));
    const result = okOf(engine.execute(paint({ points: [{ x: -3, y: -3 }, { x: 1, y: 1 }] })));
    const rect = result.changes.sprites[0]?.cels[0]?.rect;
    expect(rect).toEqual({ x: 0, y: 0, width: 2, height: 2 });
    expect(celRows(engine.state().project, rowsIds.sprite, rowsIds.cel)).toEqual(['1...', '.1..', '....', '....']);
  });

  test('is a no-op, with no new cel, when every pixel is outside', () => {
    const engine = pixelEngine(emptyProject(4, 4));
    const before = engine.state().project;
    const result = okOf(engine.execute(paint({ points: [{ x: 10, y: 10 }] })));
    expect(result.noop).toBe(true);
    expect(engine.state().project).toBe(before);
    expect(engine.state().revision).toBe(1);
  });

  test('mirrors the stroke across doubled-integer axes', () => {
    const engine = pixelEngine(emptyProject(8, 8));
    okOf(engine.execute(paint({ points: [{ x: 1, y: 1 }], symmetry: { x2: 8, y2: 8 } })));
    expect(celRows(engine.state().project, rowsIds.sprite, rowsIds.cel)).toEqual([
      '........',
      '.1....1.',
      '........',
      '........',
      '........',
      '........',
      '.1....1.',
      '........',
    ]);
  });

  test('writes only where the mask allows', () => {
    const engine = pixelEngine(emptyProject(4, 4));
    const mask = maskFromRows(['##..', '##..', '##..', '##..']);
    okOf(engine.execute(paint({ points: [{ x: 0, y: 1 }, { x: 3, y: 1 }], mask })));
    expect(celRows(engine.state().project, rowsIds.sprite, rowsIds.cel)).toEqual(['....', '11..', '....', '....']);
  });

  test('fails INCOMPATIBLE_TARGETS and names the sprite whose size the mask does not fit', () => {
    const sprite = (id: string, name: string, size: number) => ({
      id,
      name,
      width: size,
      height: size,
      frames: ['frm_000012'],
      layers: [{ id: `lay_${id.slice(4)}`, name: 'Body' }],
      cels: {},
    });
    const engine = pixelEngine(buildProject([sprite('spr_000010', 'small', 4), sprite('spr_000020', 'large', 8)]));
    const scope = scopeOf([rowsIds.sprite, brand<SpriteId>('spr_000020')], { by: 'names', names: ['Body'] });
    const mask = maskFromRows(['####', '####', '####', '####']);
    const error = errorOf(engine.execute(request([stepOf('pixels.paint', scope, { index: 1, points: [{ x: 0, y: 0 }], mask })])));
    expect(error.code).toBe('INCOMPATIBLE_TARGETS');
    expect(error.details.map((issue) => issue.spriteId)).toEqual(['spr_000020']);
  });
});

describe('pixels.paint limits', () => {
  const failing = (options: Record<string, unknown>) => {
    const engine = pixelEngine(emptyProject(4, 4));
    return errorOf(engine.execute(paint(options)));
  };

  test('rejects a brush that is too large with the option path', () => {
    const error = failing({ points: [{ x: 0, y: 0 }], brush: { shape: 'square', size: 65 } });
    expect(error.code).toBe('INVALID_OPTION');
    expect(error.path).toBe('steps.0.options.brush.size');
  });

  test('rejects an empty point list, a bad mask and an unknown option', () => {
    expect(failing({ points: [] }).path).toBe('steps.0.options.points');
    const bits = new Uint8Array(3);
    expect(failing({ points: [{ x: 0, y: 0 }], mask: { width: 2, height: 2, bits } }).path).toBe('steps.0.options.mask.bits');
    expect(failing({ points: [{ x: 0, y: 0 }], colour: 3 }).code).toBe('INVALID_OPTION');
  });

  test('rejects more than 8192 points as a batch that is too large', () => {
    const points = Array.from({ length: 8193 }, () => ({ x: 0, y: 0 }));
    expect(failing({ points }).code).toBe('BATCH_TOO_LARGE');
  });
});
