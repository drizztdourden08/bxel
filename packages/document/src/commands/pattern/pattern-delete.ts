/* @layer core @kind logic */
import { updateArtwork } from '../../draft/update-artwork';
import { patternDeleteSchema } from '../../schema/pattern-delete-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { pickPattern } from './pick-pattern';

const patternDelete = defineCommand({
  name: COMMAND_NAME.patternDelete,
  scope: 'none',
  schema: patternDeleteSchema,
  run: (draft, input) => {
    const pattern = pickPattern(draft, input.options.pattern);
    updateArtwork(draft, (artwork) => ({ ...artwork, patterns: (artwork.patterns ?? []).filter((item) => item.id !== pattern.id) }));
  },
});

export { patternDelete };
