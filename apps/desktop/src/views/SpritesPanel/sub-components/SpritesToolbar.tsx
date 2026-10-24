/* @layer renderer-app @kind component */
import { ButtonGroup, ConfirmIconButton, Flex, Icon } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { deleteSprites } from '../../../sheet/delete-sprites';
import { duplicateSprites } from '../../../sheet/duplicate-sprites';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import { SPRITE_TEXT } from '../../../sheet/sprite-label.constants';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import { PixelIcon } from '../../PixelIcon';
import type { ManagerToolbarProps } from '../SpritesPanel.type';
import { ActionsMenu } from './ActionsMenu';
import { ToolbarButton } from './ToolbarButton';

const SpritesToolbar = ({ model, groups }: ManagerToolbarProps) => {
  const { ids } = model;
  const none = ids.length === 0;
  return (
    <Flex gap="xs" align="center" wrap>
      <ButtonGroup aria-label={MANAGER_TEXT.actions}>
        <ToolbarButton label={MANAGER_TEXT.add} keys="Ctrl+Shift+N" icon={<Icon name="plus" size={16} />} onClick={() => useCreateDialogStore.getState().show('sprite')} />
        <ToolbarButton label={MANAGER_TEXT.duplicate} keys="Ctrl+Shift+D" disabled={none} icon={<Icon name="copy" size={16} />} onClick={() => duplicateSprites(ids)} />
        <ToolbarButton label={MANAGER_TEXT.isolate} keys="Enter" disabled={none} icon={<PixelIcon name="isolate" />} onClick={() => isolateSprite()} />
        <ToolbarButton label={MANAGER_TEXT.earlier} keys="Alt+Left" disabled={none} icon={<Icon name="arrow-left" size={16} />} onClick={() => reorderSprites(ids, { by: -1 })} />
        <ToolbarButton label={MANAGER_TEXT.later} keys="Alt+Right" disabled={none} icon={<Icon name="arrow-right" size={16} />} onClick={() => reorderSprites(ids, { by: 1 })} />
        <ConfirmIconButton
          icon={<Icon name="trash-2" size={16} />}
          label={MANAGER_TEXT.remove}
          confirmLabel={SPRITE_TEXT.confirmDelete(ids.length)}
          cancelLabel={MANAGER_TEXT.cancelRemove}
          size="sm"
          disabled={none}
          onConfirm={() => deleteSprites(ids)}
        />
      </ButtonGroup>
      <ActionsMenu groups={groups} />
    </Flex>
  );
};

export { SpritesToolbar };
