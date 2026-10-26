/* @layer renderer-app @kind logic */
import type { PlatformPreset } from '@bxel/presets';
import { areaRuleText } from './area-rule-text';
import { colourText } from './colour-text';
import { PLATFORM_TEXT } from './platform-preset.constants';
import type { PresetFact } from './platform-preset.type';
import { FACT_TEXT, KIND_LABELS } from './preset-facts.constants';
import { pairText } from './pair-text';
import { sizeRuleText } from './size-rule-text';

const slot0Of = (preset: PlatformPreset): string => {
  const { slot0, slot0Shared } = preset.banks;
  return slot0 === 'background' && slot0Shared ? PLATFORM_TEXT.shared : PLATFORM_TEXT.slot0[slot0];
};

const areaFacts = (preset: PlatformPreset): PresetFact[] =>
  preset.areaRules.length === 0 ? [] : [{ label: FACT_TEXT.areas, value: preset.areaRules.map(areaRuleText).join('; ') }];

const presetFacts = (preset: PlatformPreset): PresetFact[][] => [
  [
    { label: FACT_TEXT.kind, value: KIND_LABELS[preset.kind] },
    { label: FACT_TEXT.family, value: preset.family },
  ],
  [
    { label: FACT_TEXT.colours, value: colourText(preset.colour) },
    { label: FACT_TEXT.palettes, value: FACT_TEXT.paletteLine(preset.banks.count, preset.banks.size) },
    { label: FACT_TEXT.slot0, value: slot0Of(preset) },
  ],
  [
    { label: FACT_TEXT.tile, value: preset.sizes.tile === null ? FACT_TEXT.noTile : pairText(preset.sizes.tile) },
    { label: FACT_TEXT.sprites, value: sizeRuleText(preset.sizes.sprites) },
    { label: FACT_TEXT.canvas, value: pairText(preset.sizes.canvasDefault) },
    ...areaFacts(preset),
  ],
];

export { presetFacts };
