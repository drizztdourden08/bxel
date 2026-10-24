/* @layer renderer-app @kind logic */
import type { PaletteDefault } from '@bxel/project';
import { CHOICE_MARK, CHOICE_SEPARATOR } from './asset-defaults.constants';

const paletteChoice = (palette: PaletteDefault): string =>
  palette.kind === 'preset'
    ? [CHOICE_MARK.preset, palette.presetId].join(CHOICE_SEPARATOR)
    : [CHOICE_MARK.file, palette.folderId, palette.path].join(CHOICE_SEPARATOR);

export { paletteChoice };
