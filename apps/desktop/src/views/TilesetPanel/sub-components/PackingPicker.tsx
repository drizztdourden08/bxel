/* @layer renderer-app @kind component */
import { Box, Flex, Pressable, Text } from '@drizztdourden08/tessera';
import { setTerrainSets } from '../../../tilemap/set-terrain-sets';
import { fillFromLayout } from '../../../tilemap/terrain/fill-from-layout';
import { PACKINGS } from '../../../tilemap/terrain/terrain-packing.constants';
import { TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import type { PackingPickerProps } from '../behavior/terrain-panel.type';

const PackingPicker = ({ model, sets, set }: PackingPickerProps) => {
  const start = model.pickedKey === null ? 0 : (model.layout.indexOf.get(model.pickedKey) ?? 0);
  return (
    <Flex gap="xs" wrap role="group" aria-label={TERRAIN_TEXT.fillFromLayout}>
      {PACKINGS.filter((packing) => packing.kind === set.kind).map((packing) => (
        <Pressable
          key={packing.id}
          type="button"
          className="tileset-panel__packing"
          title={`${TERRAIN_TEXT.fillHint} ${packing.columns} x ${packing.rows}.`}
          onClick={() => setTerrainSets(sets.map((each) => (each.id === set.id ? fillFromLayout(set, model.layout, packing, start) : each)), TERRAIN_TEXT.fillFromLayout)}
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
};

export { PackingPicker };
