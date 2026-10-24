/* @layer renderer-app @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import type { SpriteRenameProps } from '../SpritesPanel.type';

const SpriteRename = ({ spriteName, onCommit, onCancel }: SpriteRenameProps) => (
  <Field label={MANAGER_TEXT.renameLabel} hint={MANAGER_TEXT.renameHint}>
    <TextInput
      defaultValue={spriteName}
      autoFocus
      onEnter={onCommit}
      onBlur={onCancel}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onCancel();
      }}
    />
  </Field>
);

export { SpriteRename };
