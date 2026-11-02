/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateArtwork } from '../../draft/update-artwork';
import type { PatternId } from '../../model/ids.type';
import { MAX_PATTERNS } from '../../model/limits.constants';
import type { SavedPattern } from '../../model/pattern.type';
import { decodeBrushPixels } from '../../pixels/decode-brush-pixels';
import { patternAddSchema } from '../../schema/pattern-add-schema';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const patternAdd = defineCommand({
  name: COMMAND_NAME.patternAdd,
  scope: 'none',
  schema: patternAddSchema,
  run: (draft, input) => {
    const { options } = input;
    const bytes = decodeBrushPixels(options.pixels);
    if (bytes.length !== options.width * options.height) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'The pattern pixels must be base64 for width * height bytes.', { path: 'options.pixels' });
    }
    const existing = draft.artwork.patterns ?? [];
    if (existing.length >= MAX_PATTERNS) {
      throw fail(ERROR_CODE.BATCH_TOO_LARGE, `An artwork holds at most ${MAX_PATTERNS} patterns.`);
    }
    const pattern: SavedPattern = {
      id: draft.ids.next('pat') as PatternId,
      name: checkName(options.name),
      width: options.width,
      height: options.height,
      pixels: options.pixels,
    };
    updateArtwork(draft, (artwork) => ({ ...artwork, patterns: [...existing, pattern] }));
    registerRef(draft, input.ref, pattern.id);
  },
});

export { patternAdd };
