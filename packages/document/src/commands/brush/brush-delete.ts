/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import { brushDeleteSchema } from '../../schema/brush-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickBrush } from './pick-brush';

const brushDelete = defineCommand({
  name: COMMAND_NAME.brushDelete,
  scope: 'none',
  schema: brushDeleteSchema,
  run: (draft, input) => {
    const brush = pickBrush(draft, input.options.brush);
    updateArtwork(draft, (artwork) => ({ ...artwork, brushes: (artwork.brushes ?? []).filter((item) => item.id !== brush.id) }));
  },
});

export { brushDelete };
