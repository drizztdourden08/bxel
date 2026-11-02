/* @layer renderer-app @kind component */
import { useRef } from 'react';
import { commandZone } from '@drizztdourden08/brock-react';
import type { DndElement } from '@drizztdourden08/brock-react';
import { Box, EmptyState, Stack } from '@drizztdourden08/tessera';
import { useZoneKey } from '../../../hooks/useZoneKey';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { LAYER_RENAME_KEY } from '../../../keymap/zone-key.constants';
import { useLayerViewStore } from '../../../stores/useLayerViewStore';
import { useLayerFileDrop } from '../behavior/useLayerFileDrop';
import { useLayerFilter } from '../behavior/useLayerFilter';
import { useLayerMenu } from '../behavior/useLayerMenu';
import { useLayerPick } from '../behavior/useLayerPick';
import type { LayerStackViewProps } from '../LayerStack.type';
import { LayerBar } from './LayerBar';
import { LayerFilter } from './LayerFilter';
import { LayerHeader } from './LayerHeader';
import { LayerList } from './LayerList';
import { LayerNoMatch } from './LayerNoMatch';
import { LayerStrip } from './LayerStrip';
import './LayerStackView.css';

const LayerStackView = ({ model, thumbSize, onThumbSize }: LayerStackViewProps) => {
  const { picked, pick, pickKeys } = useLayerPick(model);
  const filter = useLayerFilter(model.rows);
  const scope = useLayerViewStore((state) => state.scope);
  const setRenaming = useLayerViewStore((state) => state.setRenaming);
  const dropRef = useRef<DndElement | null>(null);
  useLayerMenu(model, picked, pick);
  useLayerFileDrop(dropRef, model);
  const renameId = model.activeId;
  useZoneKey(LAYER_RENAME_KEY, renameId === null || model.kind === 'sheet' ? null : () => setRenaming(renameId));
  if (model.empty !== null) return <EmptyState size="sm" message={model.empty} />;
  const rows = filter.filtered ? filter.shown : model.rows;
  return (
    <Stack gap="xs" className="layer-stack" data-layer-stack ref={dropRef}>
      <LayerHeader model={model} shown={filter.shown.length} thumbSize={thumbSize} onThumbSize={onThumbSize} />
      <LayerStrip model={model} picked={picked} scope={scope} onScope={useLayerViewStore.getState().setScope} />
      {filter.active && <LayerFilter text={filter.text} colour={filter.colour} onText={filter.setText} onColour={filter.setColour} />}
      <Box className="layer-stack__list" {...commandZone(COMMAND_ZONE.layers)}>
        {filter.shown.length === 0 ? (
          <LayerNoMatch onClear={filter.clear} />
        ) : (
          <LayerList model={model} rows={rows} filtered={filter.filtered} picked={picked} pick={pick} pickKeys={pickKeys} thumbSize={thumbSize} />
        )}
      </Box>
      {model.kind !== 'sheet' && <LayerBar model={model} picked={picked} />}
    </Stack>
  );
};

export { LayerStackView };
