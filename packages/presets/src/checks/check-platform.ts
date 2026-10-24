/* @layer core @kind logic */
import type { PlatformPreset } from '../model/preset.type';
import { checkBank } from './check-bank';
import { checkSizes } from './check-sizes';
import type { PlatformFacts, RuleFinding } from './finding.type';

const countFinding = (preset: PlatformPreset, count: number): RuleFinding[] =>
  count <= preset.banks.count
    ? []
    : [
        {
          rule: 'bankCount',
          tier: preset.tiers.bankCount,
          message: `The file has ${String(count)} palettes. ${preset.name} allows ${String(preset.banks.count)}.`,
          key: 'bankCount',
          excess: count - preset.banks.count,
        },
      ];

const checkPlatform = (preset: PlatformPreset, facts: PlatformFacts): readonly RuleFinding[] => [
  ...countFinding(preset, facts.banks.length),
  ...facts.banks.flatMap((bank) => checkBank(preset, bank)),
  ...checkSizes(preset, facts.sprites),
];

export { checkPlatform };
