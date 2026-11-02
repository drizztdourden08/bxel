/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { entryWarnings } from '../../src/sheet-manager/entry-warnings';
import type { SpriteFacts } from '../../src/sheet-manager/manager.type';
import { openManagedSheet, spriteFacts } from './manager-harness';

const namedFacts = (): SpriteFacts[] => spriteFacts().filter((fact) => fact.sprite.name !== 'sprite');

const firstOf = (facts: readonly SpriteFacts[]): SpriteFacts => {
  const first = facts[0];
  if (first === undefined) throw new Error('no sprite');
  return first;
};

beforeEach(openManagedSheet);

describe('S2 entry warnings', { tags: ['standard'] }, () => {
  it('warns of nothing when every sprite shares a palette and fits', () => {
    expect(entryWarnings(namedFacts(), 0).size).toBe(0);
    expect(entryWarnings(namedFacts(), 64).size).toBe(0);
  });

  it('warns of a sprite larger than a page, and not on one page', () => {
    const facts = namedFacts();
    const first = firstOf(facts);
    const wide = [{ ...first, sprite: { ...first.sprite, width: 100 } }, ...facts.slice(1)];
    expect(entryWarnings(wide, 64).get(first.sprite.id)).toContain('larger than a 64 by 64 page');
    expect(entryWarnings(wide, 0).size).toBe(0);
  });

  it('warns of a sprite whose palette differs from the most common one', () => {
    const facts = namedFacts();
    const first = firstOf(facts);
    const other = [{ ...first, bank: 'Other', sprite: { ...first.sprite, bankId: 'other-bank' as typeof first.sprite.bankId } }, ...facts.slice(1)];
    const warnings = entryWarnings(other, 0);
    expect(warnings.size).toBe(1);
    expect(warnings.get(first.sprite.id)).toContain('Palette Other differs');
  });
});
