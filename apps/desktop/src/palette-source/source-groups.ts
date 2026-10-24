/* @layer renderer-app @kind logic */
import type { SwatchLibrary } from '../swatch-library/swatch-library.type';
import { CUSTOM_CHOICE, FILE_CHOICE, PALETTE_GROUP_LABEL, PALETTE_PRESETS, PRESET_PREFIX, SET_PREFIX, SOURCE_TEXT } from './palette-source.constants';
import type { PaletteSource, SourceGroup } from './palette-source.type';

const paletteGroup = (source: PaletteSource): SourceGroup => ({
  label: PALETTE_GROUP_LABEL,
  options: [
    ...PALETTE_PRESETS.map((preset) => ({ value: `${PRESET_PREFIX}${preset.id}`, label: SOURCE_TEXT.presetLabel(preset.name) })),
    { value: CUSTOM_CHOICE, label: SOURCE_TEXT.customEntry },
    { value: FILE_CHOICE, label: source.file ? SOURCE_TEXT.chosenFile(source.file.name) : SOURCE_TEXT.fileEntry },
  ],
});

const setGroups = (library: SwatchLibrary): SourceGroup[] =>
  library.groups.map((group) => ({
    label: group.label,
    options: group.sets.map((set) => ({ value: `${SET_PREFIX}${set.key}`, label: SOURCE_TEXT.setLabel(set.name) })),
  }));

const sourceGroups = (source: PaletteSource, library: SwatchLibrary): SourceGroup[] => [paletteGroup(source), ...setGroups(library)];

export { sourceGroups };
