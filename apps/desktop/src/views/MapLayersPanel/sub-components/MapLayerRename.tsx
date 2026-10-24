/* @layer renderer-app @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera';
import { renameMapLayer } from '../../../tilemap/rename-map-layer';
import { MAP_LAYERS_TEXT } from '../MapLayersPanel.constants';
import type { MapLayerRenameProps } from '../MapLayersPanel.type';

const MapLayerRename = ({ layer, onClose }: MapLayerRenameProps) => (
  <Field label={MAP_LAYERS_TEXT.renameLabel} hint={MAP_LAYERS_TEXT.renameHint}>
    <TextInput
      defaultValue={layer.name}
      onEnter={(name) => {
        if (renameMapLayer(layer.id, name)) onClose();
      }}
      onBlur={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
    />
  </Field>
);

export { MapLayerRename };
