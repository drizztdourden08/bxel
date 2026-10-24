/* @layer core @kind logic */
import type { PlatformPreset } from '../model/preset.type';
import type { PresetDefaults, PresetSlot } from './defaults.type';
import { startColours } from './start-colours';
import { toSpriteSize } from './to-sprite-size';

const paletteSlots = (preset: PlatformPreset): PresetSlot[] => {
  const { size, slot0 } = preset.banks;
  const lead: PresetSlot[] = slot0 === 'transparent' ? [{ kind: 'transparent' }] : [];
  const colours = startColours(preset, size - lead.length);
  return [...lead, ...colours.map((rgb): PresetSlot => ({ kind: 'color', rgb }))];
};

const presetDefaults = (preset: PlatformPreset): PresetDefaults => ({
  presetId: preset.id,
  bankCount: preset.banks.count,
  bankSize: preset.banks.size,
  slot0: preset.banks.slot0,
  transparent: preset.banks.slot0 === 'transparent',
  slot0Shared: preset.banks.slot0Shared,
  palette: paletteSlots(preset),
  spriteSize: toSpriteSize(preset.sizes.canvasDefault),
  tileSize: preset.sizes.tile === null ? null : toSpriteSize(preset.sizes.tile),
});

export { presetDefaults };
