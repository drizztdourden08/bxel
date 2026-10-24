/* @layer renderer-app @kind component */
import { ButtonGroup, ConfirmIconButton, Flex, Icon } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { deleteSprites } from '../../../sheet/delete-sprites';
import { duplicateSprites } from '../../../sheet/duplicate-sprites';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import { SPRITE_TEXT } from '../../../sheet/sprite-label.constants';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import { ActionHint } from '../../ActionHint';
import { PixelIcon } from '../../PixelIcon';
import { SPRITE_HINTS } from '../SpritesPanel.constants';
import type { ManagerToolbarProps } from '../SpritesPanel.type';
import { ActionsMenu } from './ActionsMenu';
import { ToolbarButton } from './ToolbarButton';

const SpritesToolbar = ({ model, groups }: ManagerToolbarProps) => {
  const { ids } = model;
  const none = ids.length === 0;
  return (
    <Flex gap="xs" align="center" wrap>
      <ButtonGroup aria-label={MANAGER_TEXT.actions}>
        <ToolbarButton hint={SPRITE_HINTS.add} icon={<Icon name="plus" size={16} />} onClick={() => useCreateDialogStore.getState().show('sprite')} />
        <ToolbarButton hint={SPRITE_HINTS.duplicate} disabled={none} icon={<Icon name="copy" size={16} />} onClick={() => duplicateSprites(ids)} />
        <ToolbarButton hint={SPRITE_HINTS.isolate} disabled={none} icon={<PixelIcon name="isolate" />} onClick={() => isolateSprite()} />
        <ToolbarButton hint={SPRITE_HINTS.earlier} disabled={none} icon={<Icon name="arrow-left" size={16} />} onClick={() => reorderSprites(ids, { by: -1 })} />
        <ToolbarButton hint={SPRITE_HINTS.later} disabled={none} icon={<Icon name="arrow-right" size={16} />} onClick={() => reorderSprites(ids, { by: 1 })} />
        <ActionHint hint={SPRITE_HINTS.remove}>
          <ConfirmIconButton
            icon={<Icon name="trash-2" size={16} />}
            label={MANAGER_TEXT.remove}
            confirmLabel={SPRITE_TEXT.confirmDelete(ids.length)}
            cancelLabel={MANAGER_TEXT.cancelRemove}
            size="sm"
            disabled={none}
            onConfirm={() => deleteSprites(ids)}
          />
        </ActionHint>
      </ButtonGroup>
      <ActionHint hint={SPRITE_HINTS.more}>
        <ActionsMenu groups={groups} />
      </ActionHint>
    </Flex>
  );
};

export { SpritesToolbar };
