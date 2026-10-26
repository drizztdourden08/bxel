/* @layer renderer-app @kind component */
import { useState } from 'react';
import { commandZone } from '@drizztdourden08/brock-react';
import { Box, EmptyState, Flex, ScrollArea, Stack, Text } from '@drizztdourden08/tessera';
import { useZoneKey } from '../../hooks/useZoneKey';
import { COMMAND_ZONE } from '../../keymap/command-zone.constants';
import { LAYER_RENAME_KEY } from '../../keymap/zone-key.constants';
import { useMapContext } from '../../hooks/useMapContext';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { MAP_LAYERS_TEXT } from './MapLayersPanel.constants';
import { useMapLayersMenu } from './behavior/useMapLayersMenu';
import { MapLayerRename } from './sub-components/MapLayerRename';
import { MapLayerRow } from './sub-components/MapLayerRow';
import { MapLayerToolbar } from './sub-components/MapLayerToolbar';
import { MapPicker } from './sub-components/MapPicker';
import './MapLayersPanel.css';

const MapLayersPanel = () => {
  const context = useMapContext();
  const setLayer = useTilemapStore((state) => state.setLayer);
  const [renaming, setRenaming] = useState(false);
  useMapLayersMenu();
  useZoneKey(LAYER_RENAME_KEY, context?.tilemap && context.layer ? () => setRenaming(true) : null);
  if (!context?.tilemap || !context.layer) return <EmptyState size="sm" message={MAP_LAYERS_TEXT.empty} />;
  const { tilemap, layer } = context;
  return (
    <Stack gap="xs">
      {context.artwork.tilemaps.length > 1 && <MapPicker maps={context.artwork.tilemaps} current={tilemap} />}
      <Flex align="center" justify="between" gap="xs">
        <MapLayerToolbar onRename={() => setRenaming(true)} />
        <Text variant="caption" tone="muted">{MAP_LAYERS_TEXT.count(tilemap.layers.length)}</Text>
      </Flex>
      <ScrollArea axis="y" scrollbar="slim" fade={false} className="map-layers__list">
        <Box {...commandZone(COMMAND_ZONE.layers)}>
          <Box as="ul" className="map-layers__items" aria-label={MAP_LAYERS_TEXT.list}>
            {[...tilemap.layers].reverse().map((each) => (
              <MapLayerRow key={each.id} layer={each} selected={each.id === layer.id} onSelect={setLayer} />
            ))}
          </Box>
        </Box>
      </ScrollArea>
      {renaming && <MapLayerRename key={layer.id} layer={layer} onClose={() => setRenaming(false)} />}
    </Stack>
  );
};

export { MapLayersPanel };
