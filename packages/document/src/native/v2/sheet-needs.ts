/* @layer core @kind logic */
import type { SheetFileJson } from './sheet-file.type';

const sheetNeeds = (file: SheetFileJson): readonly string[] => {
  const placed = file.sheet.entries.map((entry) => entry.spriteId);
  const exported = file.presets.flatMap((preset) => preset.scope.sprites.filter((ref) => typeof ref === 'string'));
  return [...new Set<string>([...placed, ...exported])];
};

export { sheetNeeds };
