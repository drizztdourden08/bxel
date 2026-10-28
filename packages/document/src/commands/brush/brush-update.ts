/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import { brushUpdateSchema } from '../../schema/brush-update-schema';
import { checkName } from '../../validate/check-name';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickBrush } from './pick-brush';

const brushUpdate = defineCommand({
  name: COMMAND_NAME.brushUpdate,
  scope: 'none',
  schema: brushUpdateSchema,
  run: (draft, input) => {
    const brush = pickBrush(draft, input.options.brush);
    const name = checkName(input.options.name);
    if (name === brush.name) return;
    updateArtwork(draft, (artwork) => ({
      ...artwork,
      brushes: (artwork.brushes ?? []).map((item) => (item.id === brush.id ? { ...item, name } : item)),
    }));
  },
});

export { brushUpdate };
