/* @layer core @kind logic */
import { editLayerCells } from '../../draft/edit-layer-cells';
import { mapCopySchema } from '../../schema/map-copy-schema';
import { COMMAND_NAME } from '../command-name.constants';
import { defineCommand } from '../define-command';
import { assertLayerEditable } from '../tilemap/assert-layer-editable';
import { openLayer } from '../tilemap/open-layer';
import { pickMapLayer } from '../tilemap/pick-map-layer';
import { transferPlan } from '../tilemap/transfer-plan';

const mapCopy = defineCommand({
  name: COMMAND_NAME.mapCopy,
  scope: 'none',
  schema: mapCopySchema,
  run: (draft, input) => {
    const { options } = input;
    const opened = openLayer(draft, options);
    const plan = transferPlan(opened, options.from, options.to, options.empty);
    const into = options.intoLayer ? pickMapLayer(opened.tilemap, options.intoLayer).layer : opened.layer;
    assertLayerEditable(into, opened.tilemap.layers);
    editLayerCells(draft, { tilemap: opened.tilemap, layer: into }, (cells) => {
      for (const { at, value } of plan.moved) cells[at] = value;
    });
  },
});

export { mapCopy };
