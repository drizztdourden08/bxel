/* @layer core @kind test */
import type { CommandStep, DocumentId, LayerId, SpriteId, TransactionResult } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { brand } from './fixture-to-artwork';
import { bothHearts, heartEngine, patchStep, request } from './heart-engine';
import { snapshotArtwork } from './snapshot-artwork';

const failureOf = (result: TransactionResult) => {
  if (result.ok) throw new Error('the request was accepted');
  return result.error;
};

const rejects = (step: CommandStep, fields: Parameters<typeof request>[1] = {}) => {
  const { engine } = heartEngine();
  const before = snapshotArtwork(engine.state().artwork);
  const result = engine.execute(request([step], fields));
  expect(engine.state().revision).toBe(1);
  expect(snapshotArtwork(engine.state().artwork)).toBe(before);
  expect(engine.canUndo()).toBe(false);
  return failureOf(result);
};

const lockedInk: CommandStep = {
  name: 'pixels.patch',
  targets: {
    sprites: [brand<SpriteId>('spr_000020')],
    layers: { by: 'ids', ids: [brand<LayerId>('lay_000022')] },
    frames: { by: 'all' },
  },
  options: { rect: { x: 0, y: 0, width: 1, height: 1 }, pixels: new Uint8Array([1]) },
};

describe('rejection without mutation', () => {
  it('rejects a stale base revision', () => {
    expect(rejects(patchStep(6), { baseRevision: 0 }).code).toBe('STALE_REVISION');
  });

  it('rejects an index at slots.length', () => {
    const error = rejects(patchStep(7));
    expect(error.code).toBe('INDEX_OUT_OF_RANGE');
    expect(error.step).toBe(0);
    expect(error.details).toHaveLength(2);
  });

  it('rejects a patch one pixel out of bounds', () => {
    const step: CommandStep = {
      ...patchStep(6),
      options: { rect: { x: 7, y: 0, width: 2, height: 1 }, pixels: new Uint8Array([6, 6]) },
    };
    expect(rejects(step).code).toBe('OUT_OF_BOUNDS');
  });

  it('rejects painting on the locked Ink layer of heart-b', () => {
    expect(rejects(lockedInk).code).toBe('LAYER_LOCKED');
  });

  it('rejects an unknown command', () => {
    const error = rejects({ name: 'pixels.sparkle', targets: null, options: {} });
    expect(error.code).toBe('UNKNOWN_COMMAND');
    expect(error.path).toBe('steps.0.name');
  });
});

describe('rejection of bad options and targets', () => {
  it('points at the bad option path', () => {
    const step: CommandStep = {
      ...patchStep(6),
      options: { rect: { x: 'two', y: 2, width: 2, height: 1 }, pixels: new Uint8Array([6, 6]) },
    };
    const error = rejects(step);
    expect(error.code).toBe('INVALID_OPTION');
    expect(error.path).toBe('steps.0.options.rect.x');
  });

  it('rejects a document id it does not hold', () => {
    const { engine } = heartEngine();
    const result = engine.execute(request([patchStep(6)], { documentId: brand<DocumentId>('doc_000999') }));
    expect(failureOf(result).code).toBe('DOCUMENT_NOT_FOUND');
  });

  it('rejects names that collide, ignoring case', () => {
    const create: CommandStep = {
      name: 'sprite.create',
      targets: null,
      options: { name: 'HEART', width: 4, height: 4 },
    };
    expect(rejects(create).code).toBe('NAME_TAKEN');
  });

  it('lists every offending sprite when targets are incompatible', () => {
    const step: CommandStep = {
      ...patchStep(6),
      targets: { ...bothHearts, layers: { by: 'names', names: ['Ink'] } },
    };
    const error = rejects(step);
    expect(error.code).toBe('INCOMPATIBLE_TARGETS');
    expect(error.details).toHaveLength(2);
  });

  it('skips a locked layer reached by name and reports a warning', () => {
    const { engine } = heartEngine();
    const step: CommandStep = {
      ...patchStep(6),
      targets: { ...bothHearts, layers: { by: 'names', names: ['Body', 'Ink'] } },
    };
    const result = engine.execute(request([step]));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.warnings.map((warning) => warning.code)).toEqual(['LAYER_LOCKED']);
  });
});
