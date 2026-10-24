/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import { presetDeleteSchema } from '../../schema/preset-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickPreset } from './pick-preset';

const presetDelete = defineCommand({
  name: COMMAND_NAME.presetDelete,
  scope: 'none',
  schema: presetDeleteSchema,
  run: (draft, input) => {
    const preset = pickPreset(draft, input.options.preset);
    updateArtwork(draft, (artwork) => ({ ...artwork, presets: artwork.presets.filter((item) => item.id !== preset.id) }));
  },
});

export { presetDelete };
