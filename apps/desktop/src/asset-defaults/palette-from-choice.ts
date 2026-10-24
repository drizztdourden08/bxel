/* @layer renderer-app @kind logic */
import type { FolderId, PaletteDefault } from '@bxel/project';
import { CHOICE_MARK, CHOICE_SEPARATOR } from './asset-defaults.constants';

const paletteFromChoice = (choice: string): PaletteDefault | null => {
  const [mark, first, ...rest] = choice.split(CHOICE_SEPARATOR);
  if (mark === CHOICE_MARK.preset && first) return { kind: 'preset', presetId: first };
  return mark === CHOICE_MARK.file && first && rest.length > 0 ? { kind: 'file', folderId: first as FolderId, path: rest.join(CHOICE_SEPARATOR) } : null;
};

export { paletteFromChoice };
