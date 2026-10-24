/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { addToSheet } from '../../src/sheet-manager/add-to-sheet';
import { deleteImpact } from '../../src/sheet-manager/delete-impact';
import { deletePlan } from '../../src/sheet-manager/delete-plan';
import { DELETE_TEXT } from '../../src/sheet-manager/delete-text.constants';
import { duplicateNamed } from '../../src/sheet-manager/duplicate-named';
import type { RenameSpec } from '../../src/sheet-manager/manager.type';
import { planRenames } from '../../src/sheet-manager/plan-renames';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { artwork, idOf, lastNotice, namesOf, openFile, revision, spriteOf } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

const copySpec = (change: Partial<RenameSpec> = {}): RenameSpec => ({ pattern: '{name}_{n:2}', find: '', replace: '', start: 1, ...change });

const sprites = (...names: string[]) => artwork().sprites.filter((sprite) => names.includes(sprite.name));

const allNames = (): string[] => namesOf();

beforeEach(() => openFile(['walk', 'idle', 'jump'], 8));

describe('duplicating with a name pattern', () => {
  it('plans a free name for each copy and flags the ones that are taken', () => {
    const plan = planRenames(copySpec(), sprites('walk', 'idle'), allNames());
    expect(plan.entries.map((entry) => entry.to)).toEqual(['walk_01', 'idle_02']);
    expect(plan.ok).toBe(true);
    const same = planRenames(copySpec({ pattern: '{name}' }), sprites('walk'), allNames());
    expect(same.ok).toBe(false);
    const twice = planRenames(copySpec({ pattern: 'copy' }), sprites('walk', 'idle'), allNames());
    expect(twice.ok).toBe(false);
  });

  it('makes the copies after their sprites in one undo step and picks them', () => {
    const plan = planRenames(copySpec({ pattern: '{name} copy {n}' }), sprites('walk', 'jump'), allNames());
    const before = revision();
    expect(duplicateNamed(plan)).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(allNames()).toEqual(['sprite', 'walk', 'walk copy 1', 'idle', 'jump', 'jump copy 2']);
    expect(useSpriteStore.getState().selected).toEqual([idOf('walk copy 1'), idOf('jump copy 2')]);
    stepHistory('undo');
    expect(allNames()).toEqual(['sprite', 'walk', 'idle', 'jump']);
  });

  it('puts a copy on the sheet of its sprite and refuses a plan that is not ready', () => {
    addToSheet(idsOf('walk'), null);
    duplicateNamed(planRenames(copySpec({ pattern: '{name}_b' }), sprites('walk'), allNames()));
    const held = artwork().sheets[0]?.entries.map((entry) => entry.spriteId) ?? [];
    expect(held).toEqual([idOf('walk'), idOf('walk_b')]);
    const before = revision();
    expect(duplicateNamed(planRenames(copySpec({ pattern: 'idle' }), sprites('walk'), allNames()))).toBe(false);
    expect(revision()).toBe(before);
  });
});

describe('what a delete takes with it', () => {
  it('counts the sheets that hold a sprite and says so in words', () => {
    addToSheet(idsOf('walk', 'idle'), null);
    runDocument('Sheet', [{ name: COMMAND_NAME.sheetCreate, targets: null, options: { name: 'Second' } }]);
    const second = artwork().sheets.find((sheet) => sheet.name === 'Second');
    runDocument('Add', [{ name: COMMAND_NAME.sheetAdd, targets: spritesTarget(idsOf('walk')), options: { sheet: second?.id } }]);
    expect(deleteImpact(artwork(), spriteOf('walk'))).toMatchObject({ name: 'walk', sheets: 2, tilemaps: 0 });
    expect(deleteImpact(artwork(), spriteOf('idle'))).toMatchObject({ sheets: 1 });
    expect(deleteImpact(artwork(), spriteOf('jump'))).toMatchObject({ sheets: 0, tilemaps: 0 });
    expect(DELETE_TEXT.usage(2, 1)).toBe('On 2 sheets, In 1 tilemap');
    expect(DELETE_TEXT.usage(1, 0)).toBe('On 1 sheet');
  });

  it('plans how many of the picked sprites are used and refuses to take the last one', () => {
    addToSheet(idsOf('walk'), null);
    const plan = deletePlan(artwork(), sprites('walk', 'jump'));
    expect(plan.used).toBe(1);
    expect(plan.blocker).toBeNull();
    expect(plan.impacts.map((impact) => impact.name)).toEqual(['walk', 'jump']);
    expect(DELETE_TEXT.summary(1, 2)).toContain('1 of 2 sprites is used');
    expect(DELETE_TEXT.summary(0, 2)).toContain('None of these');
    const everything = deletePlan(artwork(), artwork().sprites);
    expect(everything.blocker).toContain('at least one sprite');
    expect(lastNotice()).toBeNull();
  });
});
