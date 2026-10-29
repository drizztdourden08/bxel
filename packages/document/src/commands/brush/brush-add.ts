/* @layer core @kind logic */
import { registerRef } from '../../draft/register-ref';
import { updateArtwork } from '../../draft/update-artwork';
import type { SavedBrush } from '../../model/brush.type';
import type { BrushId } from '../../model/ids.type';
import { MAX_BRUSHES } from '../../model/limits.constants';
import { decodeBrushPixels } from '../../pixels/decode-brush-pixels';
import { brushAddSchema } from '../../schema/brush-add-schema';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const brushAdd = defineCommand({
  name: COMMAND_NAME.brushAdd,
  scope: 'none',
  schema: brushAddSchema,
  run: (draft, input) => {
    const { options } = input;
    const bytes = decodeBrushPixels(options.pixels);
    if (bytes.length !== options.width * options.height) {
      throw fail(ERROR_CODE.INVALID_OPTION, 'The brush pixels must be base64 for width * height bytes.', { path: 'options.pixels' });
    }
    const existing = draft.artwork.brushes ?? [];
    if (existing.length >= MAX_BRUSHES) {
      throw fail(ERROR_CODE.BATCH_TOO_LARGE, `An artwork holds at most ${MAX_BRUSHES} brushes.`);
    }
    const brush: SavedBrush = {
      id: draft.ids.next('brs') as BrushId,
      name: checkName(options.name),
      width: options.width,
      height: options.height,
      pixels: options.pixels,
    };
    updateArtwork(draft, (artwork) => ({ ...artwork, brushes: [...existing, brush] }));
    registerRef(draft, input.ref, brush.id);
  },
});

export { brushAdd };
