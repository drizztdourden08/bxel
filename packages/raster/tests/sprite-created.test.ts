/* @layer tests @kind test */
import { describe, expect, test } from 'vitest';
import { applyTo, fresh, idle, named, run, walk } from './compose-world';

const NOW = Date.UTC(2026, 9, 24, 12, 0, 0);

describe('the created time of the sprites a split, a slice and a merge make', () => {
  test('is the time of the clock for each piece of a split', () => {
    const engine = fresh(() => NOW);
    applyTo(engine, 'sprite.split', [walk], {});
    expect(named(engine, 'walk_1').created).toBe(NOW);
    expect(named(engine, 'walk_2').created).toBe(NOW);
  });

  test('is the time of the clock for each piece of a slice and for a merged sprite', () => {
    const engine = fresh(() => NOW);
    applyTo(engine, 'sprite.slice', [run], { columns: 2, rows: 2, skipEmpty: false });
    expect(named(engine, 'run_1').created).toBe(NOW);
    applyTo(engine, 'sprite.merge', [walk, idle], { keep: true });
    expect(named(engine, 'walk merged').created).toBe(NOW);
  });

  test('stays unknown when there is no clock', () => {
    const engine = fresh();
    applyTo(engine, 'sprite.split', [walk], {});
    expect(named(engine, 'walk_1').created).toBeUndefined();
  });
});
