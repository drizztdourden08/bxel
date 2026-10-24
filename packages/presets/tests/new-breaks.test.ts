/* @layer tests @kind test */
import { checkPlatform, findNewBreaks } from '@bxel/presets';
import type { BankFacts, PlatformFacts } from '@bxel/presets';
import { describe, expect, it } from 'vitest';
import { preset, size, startBank as startBankOf } from './preset-fixtures';

const SNES = 'snes-sprite';

const startBank = (): BankFacts => startBankOf(SNES);

const facts = (bank: BankFacts, sprites = [size(16, 16)]): PlatformFacts => ({ banks: [bank], sprites });

const findings = (value: PlatformFacts) => checkPlatform(preset(SNES), value);

describe('findNewBreaks', () => {
  it('finds nothing when nothing changed', () => {
    const start = findings(facts(startBank()));
    expect(findNewBreaks(start, start)).toEqual([]);
  });

  it('finds a rule that the change breaks', () => {
    const before = findings(facts(startBank()));
    const after = findings(facts({ ...startBank(), cap: 32 }));
    expect(findNewBreaks(before, after).map((finding) => finding.rule)).toEqual(['bankSize']);
  });

  it('finds a colour that is off the platform grid', () => {
    const bank = startBank();
    const after = findings(facts({ ...bank, colours: [...bank.colours.slice(1), '#010203'] }));
    expect(findNewBreaks(findings(facts(bank)), after).map((finding) => finding.rule)).toEqual(['colour']);
  });

  it('lets an old break stay and blocks only a worse one', () => {
    const broken = { ...startBank(), colours: ['#010203'] };
    const before = findings(facts(broken));
    expect(findNewBreaks(before, before)).toEqual([]);
    const worse = findings(facts({ ...broken, colours: ['#010203', '#020304'] }));
    expect(findNewBreaks(before, worse).map((finding) => finding.rule)).toEqual(['colour']);
    const better = findings(facts({ ...broken, colours: [] }));
    expect(findNewBreaks(before, better)).toEqual([]);
  });

  it('counts a second sprite of a size the platform cannot draw', () => {
    const bank = startBank();
    const before = findings(facts(bank, [size(10, 10)]));
    const after = findings(facts(bank, [size(10, 10), size(10, 10)]));
    expect(findNewBreaks(before, after).map((finding) => finding.rule)).toEqual(['spriteSize']);
  });

  it('never reports a warning or an advisory finding', () => {
    const base = preset('generic-16');
    const generic = { ...base, sizes: { ...base.sizes, sprites: { kind: 'list', sizes: [[8, 8]] } } } as const;
    const before = checkPlatform(generic, { banks: [], sprites: [] });
    const after = checkPlatform(generic, { banks: [], sprites: [size(3, 5)] });
    expect(after.map((finding) => finding.tier)).toEqual(['advisory']);
    expect(findNewBreaks(before, after)).toEqual([]);
  });
});
