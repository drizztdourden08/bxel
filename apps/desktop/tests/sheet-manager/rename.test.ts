/* @layer renderer-app @kind test */
import { expandNamePattern as expandPattern } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import type { RenameSpec } from '../../src/sheet-manager/manager.type';
import { planRenames } from '../../src/sheet-manager/plan-renames';
import { renameSprites } from '../../src/sheet-manager/rename-sprites';
import { artwork, idOf, lastNotice, namesOf, openFile, revision } from '../sheet/sheet-harness';

const spec = (change: Partial<RenameSpec>): RenameSpec => ({ pattern: '{name}', find: '', replace: '', start: 1, ...change });

const targets = (...names: string[]) => artwork().sprites.filter((sprite) => names.includes(sprite.name));

const others = (...names: string[]): string[] => artwork().sprites.map((sprite) => sprite.name).filter((name) => !names.includes(name));

beforeEach(() => openFile(['n1', 'n2', 'n3'], 8));

describe('the rename pattern', () => {
  it('fills in the old name and a number with or without padding', () => {
    expect(expandPattern('{name}_{n}', 'walk', 7)).toBe('walk_7');
    expect(expandPattern('{n:3}-{name}', 'walk', 7)).toBe('007-walk');
    expect(expandPattern('keep {x}', 'walk', 1)).toBe('keep {x}');
  });

  it('numbers the picked sprites in order from the first number', () => {
    const plan = planRenames(spec({ pattern: 'run_{n:2}', start: 5 }), targets('n1', 'n2', 'n3'), others('n1', 'n2', 'n3'));
    expect(plan.entries.map((entry) => entry.to)).toEqual(['run_05', 'run_06', 'run_07']);
    expect(plan.ok).toBe(true);
    expect(plan.changed).toBe(3);
  });

  it('finds and replaces text in the old name before the pattern', () => {
    const plan = planRenames(spec({ pattern: 'hero_{name}', find: 'n', replace: 'k' }), targets('n1', 'n2'), others('n1', 'n2'));
    expect(plan.entries.map((entry) => entry.to)).toEqual(['hero_k1', 'hero_k2']);
  });

  it('flags a name that is taken, a name used twice and a name that is not valid', () => {
    const taken = planRenames(spec({ pattern: 'n3' }), targets('n1'), others('n1'));
    expect(taken.ok).toBe(false);
    expect(taken.entries[0]?.error).toBe('Name n3 is already used. Choose another name.');
    const twice = planRenames(spec({ pattern: 'same' }), targets('n1', 'n2'), others('n1', 'n2'));
    expect(twice.entries.every((entry) => entry.error !== null)).toBe(true);
    const empty = planRenames(spec({ pattern: ' ' }), targets('n1'), others('n1'));
    expect(empty.entries[0]?.error).toBe('A name has 1 to 64 characters you can print.');
  });

  it('is not ready when no name would change', () => {
    const plan = planRenames(spec({}), targets('n1'), others('n1'));
    expect(plan.changed).toBe(0);
    expect(plan.ok).toBe(false);
  });
});

describe('renaming many sprites', () => {
  it('renames them in one undo step named after the count', () => {
    const before = revision();
    const plan = planRenames(spec({ pattern: 'hero_{n:2}' }), targets('n1', 'n2', 'n3'), others('n1', 'n2', 'n3'));
    expect(renameSprites(plan)).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(namesOf()).toEqual(['sprite', 'hero_01', 'hero_02', 'hero_03']);
    stepHistory('undo');
    expect(namesOf()).toEqual(['sprite', 'n1', 'n2', 'n3']);
  });

  it('can shift names into each other without a clash', () => {
    const plan = planRenames(spec({ pattern: 'n{n}', start: 2 }), targets('n1', 'n2', 'n3'), others('n1', 'n2', 'n3'));
    expect(plan.entries.map((entry) => entry.to)).toEqual(['n2', 'n3', 'n4']);
    expect(plan.ok).toBe(true);
    expect(renameSprites(plan)).toBe(true);
    expect(namesOf()).toEqual(['sprite', 'n2', 'n3', 'n4']);
    expect(idOf('n4')).toBeDefined();
  });

  it('changes nothing when the plan has a problem', () => {
    const plan = planRenames(spec({ pattern: 'sprite' }), targets('n1'), others('n1'));
    const before = revision();
    expect(renameSprites(plan)).toBe(false);
    expect(revision()).toBe(before);
    expect(lastNotice()).toBeNull();
  });
});
