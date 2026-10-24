/* @layer core @kind logic */
import { mapEraseSchema } from '../../schema/map-erase-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { placeCells } from '../tilemap/place-cells';

const mapErase = defineCommand({
  name: COMMAND_NAME.mapErase,
  scope: 'none',
  schema: mapEraseSchema,
  run: (draft, input) => {
    placeCells(draft, input.options, () => 0);
  },
});

export { mapErase };
