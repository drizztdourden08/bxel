/* @layer renderer-app @kind component */
import { ButtonGroup, ConfirmIconButton, Icon, IconButton, Tooltip } from '@drizztdourden08/tessera';
import { deleteSprites } from '../../../sheet/delete-sprites';
import { duplicateSprites } from '../../../sheet/duplicate-sprites';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import { selectionIds } from '../../../sheet/selection-ids';
import { SPRITE_TEXT } from '../../../sheet/sprite-label.constants';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import { SPRITES_TEXT } from '../SpritesPanel.constants';
import type { SpritesToolbarProps } from '../SpritesPanel.type';

const SpritesToolbar = ({ scene }: SpritesToolbarProps) => {
  const ids = selectionIds(scene);
  const named = (label: string, key: string): string => `${label} (${key})`;
  return (
    <ButtonGroup aria-label={SPRITES_TEXT.actions}>
      <Tooltip content={named(SPRITES_TEXT.add, SPRITES_TEXT.addKey)} placement="bottom">
        <IconButton label={SPRITES_TEXT.add} size="sm" onClick={() => useCreateDialogStore.getState().show('sprite')}>
          <Icon name="plus" size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip content={named(SPRITES_TEXT.duplicate, SPRITES_TEXT.duplicateKey)} placement="bottom">
        <IconButton label={SPRITES_TEXT.duplicate} size="sm" onClick={() => duplicateSprites(ids)}>
          <Icon name="copy" size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip content={named(SPRITES_TEXT.earlier, SPRITES_TEXT.earlierKey)} placement="bottom">
        <IconButton label={SPRITES_TEXT.earlier} size="sm" onClick={() => reorderSprites(ids, { by: -1 })}>
          <Icon name="arrow-left" size={16} />
        </IconButton>
      </Tooltip>
      <Tooltip content={named(SPRITES_TEXT.later, SPRITES_TEXT.laterKey)} placement="bottom">
        <IconButton label={SPRITES_TEXT.later} size="sm" onClick={() => reorderSprites(ids, { by: 1 })}>
          <Icon name="arrow-right" size={16} />
        </IconButton>
      </Tooltip>
      <ConfirmIconButton
        icon={<Icon name="trash-2" size={16} />}
        label={SPRITES_TEXT.remove}
        confirmLabel={SPRITE_TEXT.confirmDelete(ids.length)}
        cancelLabel={SPRITES_TEXT.cancelRemove}
        size="sm"
        onConfirm={() => deleteSprites(ids)}
      />
    </ButtonGroup>
  );
};

export { SpritesToolbar };
