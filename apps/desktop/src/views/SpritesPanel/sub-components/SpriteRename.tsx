/* @layer renderer-app @kind component */
import { Field, TextInput } from '@drizztdourden08/tessera';
import { SPRITES_TEXT } from '../SpritesPanel.constants';
import type { SpriteRenameProps } from '../SpritesPanel.type';

const SpriteRename = ({ spriteName, onCommit, onCancel }: SpriteRenameProps) => (
  <Field label={SPRITES_TEXT.renameLabel} hint={SPRITES_TEXT.renameHint}>
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
