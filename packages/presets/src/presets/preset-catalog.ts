/* @layer core @kind logic */
import type { PlatformPreset } from '../model/preset.type';
import { FANTASY_PRESETS } from './fantasy-presets';
import { GAME_BOY_PRESETS } from './game-boy-presets';
import { GBA_PRESETS } from './gba-presets';
import { GENERIC_SPECS } from './generic-presets';
import { makeGenericPreset } from './make-generic-preset';
import { NES_PRESETS } from './nes-presets';
import { SEGA_PRESETS } from './sega-presets';
import { SNES_PRESETS } from './snes-presets';

const presetCatalog = (): readonly PlatformPreset[] => [
  ...GENERIC_SPECS.map((spec) => makeGenericPreset(spec.id, spec.size)),
  ...NES_PRESETS,
  ...GAME_BOY_PRESETS,
  ...GBA_PRESETS,
  ...SNES_PRESETS,
  ...SEGA_PRESETS,
  ...FANTASY_PRESETS,
];

export { presetCatalog };
