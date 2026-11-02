/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { formatFieldList } from '../../src/asset-config/format-field-list';
import { parseFieldList } from '../../src/asset-config/parse-field-list';

describe('K1 tileset data field list', { tags: ['critical'] }, () => {
  it('reads name:kind entries and choice lists, and keeps the default of a field that did not change', () => {
    const now = [{ name: 'hp', kind: 'int', default: 5 }] as const;
    expect(parseFieldList('hp:int, tag:text, ground:choice(stone|water)', now)).toEqual([
      { name: 'hp', kind: 'int', default: 5 },
      { name: 'tag', kind: 'text', default: '' },
      { name: 'ground', kind: 'choice', default: 'stone', choices: ['stone', 'water'] },
    ]);
  });

  it('refuses a bad kind, an empty choice list and a repeated name', () => {
    expect(parseFieldList('hp:big', [])).toBeNull();
    expect(parseFieldList('ground:choice()', [])).toBeNull();
    expect(parseFieldList('hp:int, hp:text', [])).toBeNull();
    expect(parseFieldList('', [])).toEqual([]);
  });

  it('writes the list back in the same form', () => {
    const fields = parseFieldList('hp:int, ground:choice(stone|water)', []) ?? [];
    expect(formatFieldList(fields)).toBe('hp:int, ground:choice(stone|water)');
  });
});
