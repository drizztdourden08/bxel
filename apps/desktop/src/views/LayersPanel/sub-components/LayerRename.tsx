/* @layer renderer-app @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera';
import { LAYERS_PANEL_TEXT } from '../LayersPanel.constants';
import type { LayerRenameProps } from '../LayersPanel.type';

const LayerRename = ({ layerName, onCommit, onCancel }: LayerRenameProps) => (
  <Field label={LAYERS_PANEL_TEXT.renameLabel} hint={LAYERS_PANEL_TEXT.renameHint}>
    <TextInput
      defaultValue={layerName}
      onEnter={onCommit}
      onBlur={onCancel}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onCancel();
      }}
    />
  </Field>
);

export { LayerRename };
