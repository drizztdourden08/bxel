/* @layer renderer-app @kind component */
import { Flex, Pressable, Stack, Text } from '@drizztdourden08/tessera';
import { setTerrainSets } from '../../../tilemap/set-terrain-sets';
import { TERRAIN_KIND_CHOICES, TERRAIN_TEXT } from '../../../tilemap/terrain/terrain.constants';
import { newTerrainSet } from '../../../tilemap/terrain/new-terrain-set';
import { SlotGlyph } from './SlotGlyph';

const TerrainStart = () => (
  <Stack gap="xs">
    <Text variant="caption" tone="muted">
      {TERRAIN_TEXT.start}
    </Text>
    <Flex gap="xs" wrap>
      {TERRAIN_KIND_CHOICES.map((choice) => (
        <Pressable key={choice.kind} type="button" className="tileset-panel__kind" title={choice.description} onClick={() => setTerrainSets([newTerrainSet(choice.kind, [])])}>
          <SlotGlyph mask={choice.glyph} big />
          <Text variant="caption">{choice.label}</Text>
        </Pressable>
      ))}
    </Flex>
  </Stack>
);

export { TerrainStart };
