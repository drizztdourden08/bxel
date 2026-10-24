/* @layer renderer-app @kind component */
import type { LayerId } from '@bxel/document';
import { Box, EmptyState, ReorderList, Stack, Text } from '@drizztdourden08/tessera';
import { FOCUS_ZONE } from '../../editor/focus/focus-zone.constants';
import { layerItems } from '../../editor/layer-items';
import { moveLayer } from '../../editor/move-layer';
import { renameLayer } from '../../editor/rename-layer';
import { updateLayerFlag } from '../../editor/update-layer-flag';
import { useEditorTarget } from '../../hooks/useEditorTarget';
import { useToolStore } from '../../stores/useToolStore';
import { LAYER_TOGGLES, LAYERS_PANEL_TEXT } from './LayersPanel.constants';
import { useLayerRename } from './behavior/useLayerRename';
import { useLayersKeys } from './behavior/useLayersKeys';
import { LayerRename } from './sub-components/LayerRename';
import { LayersToolbar } from './sub-components/LayersToolbar';

const LayersPanel = () => {
  const target = useEditorTarget();
  const setLayer = useToolStore((state) => state.setLayer);
  const rename = useLayerRename();
  const onKeyDown = useLayersKeys(target?.layerId ?? null, rename.begin);
  if (!target) return <EmptyState message={LAYERS_PANEL_TEXT.empty} />;
  const { sprite, layerId } = target;
  const renaming = sprite.layers.find((layer) => layer.id === rename.renamingId);
  return (
    <Stack gap="sm">
      <Text variant="label">{LAYERS_PANEL_TEXT.title}</Text>
      <Text variant="caption" tone="muted">{LAYERS_PANEL_TEXT.count(sprite.layers.length)}</Text>
      <LayersToolbar />
      <Box onKeyDown={onKeyDown} data-focus-zone={FOCUS_ZONE.layers}>
        <ReorderList
          label={LAYERS_PANEL_TEXT.list}
          items={layerItems(sprite)}
          toggles={LAYER_TOGGLES}
          selectedId={layerId}
          onSelect={(id) => setLayer(id as LayerId)}
          onMove={moveLayer}
          onToggle={(id, toggle, next) => {
            if (toggle === 'visible' || toggle === 'locked') updateLayerFlag(id as LayerId, toggle, next);
          }}
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
