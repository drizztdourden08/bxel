/* @layer tests @kind test */
import type { RampId } from '@bxel/document';
import { describe, expect, test } from 'vitest';
import { celRows, errorOf, expectOneUndo, expectPreviewEqualsCommit, maskFromRows, okOf, pixelEngine, request, scopeOf, stepOf } from './advanced-kit';
import { brand } from './brand';
import { rampArtwork } from './ramp-artwork';
import { rowsIds } from './rows-artwork';

const ROWS = ['1234', '5.61', '....'];
const scope = scopeOf([rowsIds.sprite]);
const step = (extra: Record<string, unknown>) => stepOf('pixels.replace_ramp', scope, { from: 'Violet', to: 'Short', ...extra });
const rowsOf = (engine: ReturnType<typeof pixelEngine>) => celRows(engine.state().artwork, rowsIds.sprite, rowsIds.cel);

const withShort = (rows: readonly string[]) => {
  const artwork = rampArtwork(rows);
  const [bank] = artwork.banks;
  if (!bank) throw new Error('the artwork needs a bank');
  const swatch = (slot: number) => bank.slots[slot]?.id;
  const ids = [swatch(5), swatch(6)].flatMap((id) => (id ? [id] : []));
  return { ...artwork, banks: [{ ...bank, ramps: [...bank.ramps, { id: brand<RampId>('rmp_000092'), name: 'Short', swatches: ids }] }] };
};

describe('pixels.replace_ramp', () => {
  test('maps each step to the step at the same place and leaves other indices alone', () => {
    const engine = pixelEngine(withShort(ROWS));
    const original = engine.state().artwork;
    const result = okOf(engine.execute(request([step({})])));
    expect(rowsOf(engine)).toEqual(['5566', '5.65', '....']);
    expect(result.report).toEqual({ pixelsReplaced: 5 });
    expectOneUndo(engine, original);
  });

  test('stays inside the mask', () => {
    const engine = pixelEngine(withShort(ROWS));
    const mask = maskFromRows(['##..', '....', '....']);
    okOf(engine.execute(request([step({ mask })])));
    expect(rowsOf(engine)).toEqual(['5534', '5.61', '....']);
  });

  test('the same ramp in and out is a no-op', () => {
    const engine = pixelEngine(withShort(ROWS));
    const result = okOf(engine.execute(request([step({ to: 'Violet' })])));
    expect(result.noop).toBe(true);
    expect(engine.state().revision).toBe(1);
  });

  test('refuses a ramp the palette does not have', () => {
    const engine = pixelEngine(withShort(ROWS));
    expect(errorOf(engine.execute(request([step({ to: 'Missing' })]))).code).toBe('TARGET_NOT_FOUND');
  });

  test('the preview equals the commit', () => {
    expectPreviewEqualsCommit(withShort(ROWS), step({}));
  });
});
