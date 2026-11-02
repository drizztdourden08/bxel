/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import type { SavedPattern } from '../../model/pattern.type';
import { decodeBrushPixels } from '../../pixels/decode-brush-pixels';
import { patternUpdateSchema } from '../../schema/pattern-update-schema';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { pickPattern } from './pick-pattern';

const patternUpdate = defineCommand({
  name: COMMAND_NAME.patternUpdate,
  scope: 'none',
  schema: patternUpdateSchema,
  run: (draft, input) => {
    const { options } = input;
    const pattern = pickPattern(draft, options.pattern);
    const next: SavedPattern = {
      ...pattern,
      name: options.name === undefined ? pattern.name : checkName(options.name),
      width: options.width ?? pattern.width,
      height: options.height ?? pattern.height,
      pixels: options.pixels ?? pattern.pixels,
    };
    if (decodeBrushPixels(next.pixels).length !== next.width * next.height) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'The pattern pixels must be base64 for width * height bytes.', { path: 'options.pixels' });
    }
    if (JSON.stringify(next) === JSON.stringify(pattern)) return;
    updateArtwork(draft, (artwork) => ({
      ...artwork,
      patterns: (artwork.patterns ?? []).map((item) => (item.id === pattern.id ? next : item)),
    }));
  },
});

export { patternUpdate };
