/* @layer renderer-app @kind component */
import { Field, Select } from '@drizztdourden08/tessera';
import type { TilemapId } from '@bxel/document';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { MAP_LAYERS_TEXT } from '../MapLayersPanel.constants';
import type { MapPickerProps } from '../MapLayersPanel.type';

const MapPicker = ({ maps, current }: MapPickerProps) => (
  <Field label={MAP_LAYERS_TEXT.maps}>
    <Select
      aria-label={MAP_LAYERS_TEXT.maps}
      value={current.id}
      options={maps.map((each) => ({ value: each.id, label: `${each.name} (${each.columns} x ${each.rows})` }))}
      onChange={(value) => useTilemapStore.getState().setMap(value as TilemapId)}
    />
  </Field>
);

export { MapPicker };
