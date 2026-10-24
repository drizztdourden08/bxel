/* @layer core @kind logic */
import type { PlatformPreset } from '../model/preset.type';
import { snapPalette } from '../snap/snap-palette';
import type { BankFacts, RuleFinding } from './finding.type';

const sizeFinding = (preset: PlatformPreset, bank: BankFacts): RuleFinding[] =>
  bank.cap === preset.banks.size
    ? []
    : [
        {
          rule: 'bankSize',
          tier: preset.tiers.bankSize,
          message: `${bank.name} holds ${String(bank.cap)} slots. ${preset.name} uses ${String(preset.banks.size)}.`,
        },
      ];

const slot0Finding = (preset: PlatformPreset, bank: BankFacts): RuleFinding[] =>
  preset.banks.slot0 === 'transparent' && !bank.transparent
    ? [{ rule: 'slot0', tier: preset.tiers.slot0, message: `${bank.name} needs slot 0 to be transparent for ${preset.name}.` }]
    : [];

const colourFinding = (preset: PlatformPreset, bank: BankFacts): RuleFinding[] => {
  const snapped = snapPalette(preset, bank.colours);
  if (!snapped.ok || snapped.value.moved === 0) return [];
  const count = snapped.value.moved;
  const word = count === 1 ? '1 colour is' : `${String(count)} colours are`;
  return [{ rule: 'colour', tier: preset.tiers.colour, message: `${word} not on the ${preset.name} colour grid in ${bank.name}.` }];
};

const checkBank = (preset: PlatformPreset, bank: BankFacts): readonly RuleFinding[] => [
  ...sizeFinding(preset, bank),
  ...slot0Finding(preset, bank),
  ...colourFinding(preset, bank),
];

export { checkBank };
