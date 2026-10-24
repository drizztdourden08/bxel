/* @layer core @kind data */
import { NES_COLOURS } from '../colours/nes-colours';
import type { PlatformPreset } from '../model/preset.type';
import { AREA_ATTRIBUTE_16 } from './area-rules.constants';
import { TIERS_STRICT } from './rule-tiers.constants';
import { SIZES_8_OR_8X16, SIZES_TILE_STEPS } from './sprite-sizes.constants';

const NES_PRESETS: readonly PlatformPreset[] = [
  {
    id: 'nes-sprite',
    name: 'NES sprite',
    family: 'NES',
    version: 1,
    kind: 'sprite',
    banks: { count: 4, size: 4, slot0: 'transparent', slot0Forced: true, slot0Shared: false },
    colour: { kind: 'fixedSet', colours: NES_COLOURS },
    startPalette: null,
    sizes: { tile: [8, 8], sprites: SIZES_8_OR_8X16, canvasDefault: [8, 8] },
    areaRules: [],
    tiers: TIERS_STRICT,
    notes: [
      'Four sprite palettes of four colours. Colour 0 of each palette is never drawn.',
      'Each sprite entry picks one palette. Three visible colours per palette, 12 in total.',
      'The sprite mode (8x8 or 8x16) is one choice for the whole project.',
      'Colours: Lospec NES palette, 55 entries (lospec.com/palette-list/nintendo-entertainment-system). The NES output is analog, so this list is one named variant and not a hardware table.',
      'Rules: NESdev wiki, PPU palettes (nesdev.org/wiki/PPU_palettes).',
    ],
    advisory: [
      'The hardware draws 8 sprites per scanline and 64 sprites in total.',
      'PPUMASK emphasis bits tint the whole picture and are not modelled.',
    ],
  },
  {
    id: 'nes-bg',
    name: 'NES background',
    family: 'NES',
    version: 1,
    kind: 'tile',
    banks: { count: 4, size: 4, slot0: 'background', slot0Forced: true, slot0Shared: true },
    colour: { kind: 'fixedSet', colours: NES_COLOURS },
    startPalette: null,
    sizes: { tile: [8, 8], sprites: SIZES_TILE_STEPS, canvasDefault: [16, 16] },
    areaRules: [AREA_ATTRIBUTE_16],
    tiers: TIERS_STRICT,
    notes: [
      'Four background palettes of four colours. Slot 0 is one shared backdrop colour, so 13 colours in total.',
      'The attribute table gives each 16x16 area one palette.',
      'Colours: Lospec NES palette, 55 entries (lospec.com/palette-list/nintendo-entertainment-system).',
      'Rules: NESdev wiki, PPU palettes and attribute table (nesdev.org/wiki/PPU_palettes, nesdev.org/wiki/PPU_attribute_tables).',
    ],
    advisory: ['Hues $0E and $0F mirror $1D (black), and $0D should not be used.'],
  },
];

export { NES_PRESETS };
