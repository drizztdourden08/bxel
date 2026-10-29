/* @layer core @kind logic */
import { editLayerCells } from '../../draft/edit-layer-cells';
import { mapMoveSchema } from '../../schema/map-move-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { openLayer } from '../tilemap/open-layer';
import { transferPlan } from '../tilemap/transfer-plan';

const mapMove = defineCommand({
  name: COMMAND_NAME.mapMove,
  scope: 'none',
  schema: mapMoveSchema,
  run: (draft, input) => {
    const { options } = input;
    const opened = openLayer(draft, options);
    const plan = transferPlan(opened, options.from, options.to, options.empty);
    editLayerCells(draft, opened, (cells) => {
      plan.mask.forEach((bit, index) => {
        if (bit === 1) cells[index] = 0;
      });
      for (const { at, value } of plan.moved) cells[at] = value;
    });
  },
});

export { mapMove };
