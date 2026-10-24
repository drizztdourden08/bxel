/* @layer renderer-app @kind component */
import { ButtonGroup, Icon, IconButton } from '@drizztdourden08/tessera';
import { addMapLayer } from '../../../tilemap/add-map-layer';
import { deleteMapLayer } from '../../../tilemap/delete-map-layer';
import { moveMapLayer } from '../../../tilemap/move-map-layer';
import { ActionHint } from '../../ActionHint';
import { ADD_LAYER_HINT, DELETE_LAYER_HINT, DOWN_LAYER_HINT, MAP_LAYERS_TEXT, RENAME_LAYER_HINT, UP_LAYER_HINT } from '../MapLayersPanel.constants';
import type { MapLayerToolbarProps } from '../MapLayersPanel.type';

const MapLayerToolbar = ({ onRename }: MapLayerToolbarProps) => (
  <ButtonGroup aria-label={MAP_LAYERS_TEXT.actions}>
    <ActionHint hint={ADD_LAYER_HINT}>
      <IconButton label={ADD_LAYER_HINT.name} size="sm" onClick={addMapLayer}>
        <Icon name="pixel-map-layer-add" />
      </IconButton>
    </ActionHint>
    <ActionHint hint={UP_LAYER_HINT}>
      <IconButton label={UP_LAYER_HINT.name} size="sm" onClick={() => moveMapLayer(1)}>
        <Icon name="arrow-up" size={16} />
      </IconButton>
    </ActionHint>
    <ActionHint hint={DOWN_LAYER_HINT}>
      <IconButton label={DOWN_LAYER_HINT.name} size="sm" onClick={() => moveMapLayer(-1)}>
        <Icon name="arrow-down" size={16} />
      </IconButton>
    </ActionHint>
    <ActionHint hint={RENAME_LAYER_HINT}>
      <IconButton label={RENAME_LAYER_HINT.name} size="sm" onClick={onRename}>
        <Icon name="pencil" size={16} />
      </IconButton>
    </ActionHint>
    <ActionHint hint={DELETE_LAYER_HINT}>
      <IconButton label={DELETE_LAYER_HINT.name} size="sm" onClick={deleteMapLayer}>
        <Icon name="trash-2" size={16} />
      </IconButton>
    </ActionHint>
  </ButtonGroup>
);

export { MapLayerToolbar };
