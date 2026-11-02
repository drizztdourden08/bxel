/* @layer renderer-app @kind component */
import { Box, Flex, Pressable, Text } from '@drizztdourden08/tessera';
import { PACKINGS } from '@bxel/document';
import { fillPacking } from '../../../tilemap/terrain/fill-packing';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import type { PackingPickerProps } from '../behavior/terrain-panel.type';

const PackingPicker = ({ model, set }: PackingPickerProps) => (
  <Flex gap="xs" wrap role="group" aria-label={TERRAIN_TEXT.fillFromLayout}>
    {PACKINGS.filter((packing) => packing.kind === set.kind).map((packing) => (
      <Pressable
        key={packing.id}
        type="button"
        className="tileset-panel__packing"
        title={`${TERRAIN_TEXT.fillHint} ${packing.columns} x ${packing.rows}.`}
        onClick={() => fillPacking({ set: set.id, packing: packing.id, start: model.pickedKey })}
      >
        <Box className="tileset-panel__packing-grid" data-columns={packing.columns} aria-hidden="true">
          {Array.from({ length: packing.columns * packing.rows }, (_unused, at) => (
            <Box key={at} className={at < set.slots.length ? 'tileset-panel__packing-cell tileset-panel__packing-cell--on' : 'tileset-panel__packing-cell'} />
          ))}
        </Box>
        <Text variant="caption">{`${packing.columns} x ${packing.rows}`}</Text>
      </Pressable>
    ))}
  </Flex>
);

export { PackingPicker };
