/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { PIVOT_PRESETS } from '../../src/sheet-manager/manager.constants';
import { pivotFor } from '../../src/sheet-manager/pivot-for';
import { pivotLabel } from '../../src/sheet-manager/pivot-label';
import { pivotSummary } from '../../src/sheet-manager/pivot-summary';
import { setPivots } from '../../src/sheet-manager/set-pivots';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { idOf, openFile, revision, spriteOf } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

const preset = (id: string) => {
  const found = PIVOT_PRESETS.find((each) => each.id === id);
  if (!found) throw new Error(`no preset ${id}`);
  return { kind: 'preset', fx: found.fx, fy: found.fy } as const;
};

beforeEach(() => openFile(['a', 'b'], 8));

describe('pivot values', () => {
  it('computes the presets in half pixels', () => {
    const sprite = spriteOf('a');
    expect(pivotFor(sprite, preset('center'), undefined)).toEqual({ x2: 8, y2: 8 });
    expect(pivotFor(sprite, preset('bottom-center'), undefined)).toEqual({ x2: 8, y2: 16 });
    expect(pivotFor(sprite, preset('top-left'), undefined)).toEqual({ x2: 0, y2: 0 });
  });

  it('turns exact pixels into half pixels and keeps them inside the sprite', () => {
    const sprite = spriteOf('a');
    expect(pivotFor(sprite, { kind: 'exact', x: 2.5, y: 3 }, undefined)).toEqual({ x2: 5, y2: 6 });
    expect(pivotFor(sprite, { kind: 'exact', x: 99, y: -4 }, undefined)).toEqual({ x2: 16, y2: 0 });
  });

  it('shows one value or Mixed', () => {
    const both = [spriteOf('a'), spriteOf('b')];
    expect(pivotSummary(both, 'Mixed')).toBe('4, 4');
    expect(pivotLabel(spriteOf('a'))).toBe('4, 4');
    setPivots(idsOf('b'), { kind: 'exact', x: 1, y: 1 });
    expect(pivotSummary([spriteOf('a'), spriteOf('b')], 'Mixed')).toBe('Mixed');
    expect(pivotSummary([], 'Mixed')).toBe('');
  });
});

describe('setting pivots', () => {
  it('sets many sprites in one undo step', () => {
    const before = revision();
    expect(setPivots(idsOf('a', 'b'), preset('bottom-center'))).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(spriteOf('a').pivot).toEqual({ x2: 8, y2: 16 });
    expect(spriteOf('b').pivot).toEqual({ x2: 8, y2: 16 });
    stepHistory('undo');
    expect(spriteOf('a').pivot).toEqual({ x2: 8, y2: 8 });
  });

  it('copies the pivot of the first sprite to the others', () => {
    setPivots(idsOf('a'), { kind: 'exact', x: 1.5, y: 2 });
    expect(setPivots(idsOf('a', 'b'), { kind: 'first' })).toBe(true);
    expect(spriteOf('b').pivot).toEqual({ x2: 3, y2: 4 });
  });

  it('does nothing when no pivot would change', () => {
    const before = revision();
    expect(setPivots(idsOf('a'), preset('center'))).toBe(false);
    expect(setPivots([], preset('center'))).toBe(false);
    expect(revision()).toBe(before);
  });

  it('uses the same engine command as a single edit', () => {
    const step = { name: COMMAND_NAME.spriteUpdate, targets: spritesTarget([idOf('a')]), options: { pivot: { x2: 2, y2: 2 } } };
    runDocument('Pivot', [step]);
    expect(spriteOf('a').pivot).toEqual({ x2: 2, y2: 2 });
  });
});
