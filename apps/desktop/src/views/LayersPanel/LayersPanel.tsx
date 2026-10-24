/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { Box, EmptyState, Stack, Text } from '@drizztdourden08/tessera';
import { COMMAND_ZONE } from '../../keymap/command-zone.constants';
import { LAYER_RENAME_KEY } from '../../keymap/zone-key.constants';
import { layerItems } from '../../editor/layer-items';
import { moveLayer } from '../../editor/move-layer';
import { renameLayer } from '../../editor/rename-layer';
import { updateLayerFlag } from '../../editor/update-layer-flag';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { useZoneKey } from '../../hooks/useZoneKey';
import { useToolStore } from '../../stores/useToolStore';
import { LAYERS_PANEL_TEXT } from './LayersPanel.constants';
import { useLayerRename } from './behavior/useLayerRename';
import { LayerList } from './sub-components/LayerList';
import { LayerRename } from './sub-components/LayerRename';
import { LayersToolbar } from './sub-components/LayersToolbar';

const LayersPanel = () => {
  const target = useEditorTarget();
  const setLayer = useToolStore((state) => state.setLayer);
  const rename = useLayerRename();
  const renameLayerId = target?.layerId ?? null;
  useZoneKey(LAYER_RENAME_KEY, renameLayerId === null ? null : () => rename.begin(renameLayerId));
  if (!target) return <EmptyState message={LAYERS_PANEL_TEXT.empty} />;
  const { sprite, layerId } = target;
  const renaming = sprite.layers.find((layer) => layer.id === rename.renamingId);
  return (
    <Stack gap="sm">
      <Text variant="label">{LAYERS_PANEL_TEXT.title}</Text>
      <Text variant="caption" tone="muted">{LAYERS_PANEL_TEXT.count(sprite.layers.length)}</Text>
      <LayersToolbar />
      <Box {...commandZone(COMMAND_ZONE.layers)}>
        <LayerList
          items={layerItems(sprite)}
          selectedId={layerId}
          onSelect={setLayer}
          onMove={moveLayer}
          onToggle={updateLayerFlag}
        />
      </Box>
      {renaming && (
        <LayerRename
          key={renaming.id}
          layerName={renaming.name}
          onCancel={rename.finish}
          onCommit={(name) => {
            if (renameLayer(renaming.id, name)) rename.finish();
          }}
        />
      )}
    </Stack>
  );
};

export { LayersPanel };
