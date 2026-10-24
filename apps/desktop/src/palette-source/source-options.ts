/* @layer renderer-app @kind logic */
import { CUSTOM_CHOICE, FILE_CHOICE, PALETTE_PRESETS, PRESET_PREFIX, SOURCE_TEXT } from './palette-source.constants';
import type { PaletteSource, SourceOption } from './palette-source.type';

const sourceOptions = (source: PaletteSource): SourceOption[] => [
  ...PALETTE_PRESETS.map((preset) => ({ value: `${PRESET_PREFIX}${preset.id}`, label: SOURCE_TEXT.presetLabel(preset.name) })),
  { value: CUSTOM_CHOICE, label: SOURCE_TEXT.customEntry },
  { value: FILE_CHOICE, label: source.file ? SOURCE_TEXT.chosenFile(source.file.name) : SOURCE_TEXT.fileEntry },
];

export { sourceOptions };
