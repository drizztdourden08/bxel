/* @layer renderer-app @kind component */
import { ButtonGroup, Flex, Icon } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { duplicateSprites } from '../../../sheet/duplicate-sprites';
import { isolateSprite } from '../../../sheet/isolate-sprite';
import { reorderSprites } from '../../../sheet/reorder-sprites';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import { ActionHint } from '../../ActionHint';
import { PixelIcon } from '../../PixelIcon';
import { SPRITE_HINTS, SPRITE_STEPS } from '../SpritesPanel.constants';
import type { ManagerToolbarProps } from '../SpritesPanel.type';
import { ActionsMenu } from './ActionsMenu';
import { ToolbarButton } from './ToolbarButton';

const SpritesToolbar = ({ model, groups, open }: ManagerToolbarProps) => {
  const { ids } = model;
  const none = ids.length === 0;
  return (
    <Flex gap="xs" align="center" wrap>
      <ButtonGroup aria-label={MANAGER_TEXT.actions}>
        <ToolbarButton hint={SPRITE_HINTS.add} icon={<Icon name="plus" size={16} />} onClick={() => useCreateDialogStore.getState().show('sprite')} />
        <ToolbarButton hint={SPRITE_HINTS.duplicate} disabled={none} icon={<Icon name="copy" size={16} />} onClick={() => duplicateSprites(ids)} />
        <ToolbarButton hint={SPRITE_HINTS.isolate} disabled={none} icon={<PixelIcon name="isolate" />} onClick={() => isolateSprite()} />
        {SPRITE_STEPS.map((step) => (
          <ToolbarButton key={step.icon} hint={step.hint} disabled={none} icon={<Icon name={step.icon} size={16} />} onClick={() => reorderSprites(ids, { by: step.by })} />
        ))}
        <ToolbarButton hint={SPRITE_HINTS.remove} disabled={none} icon={<Icon name="trash-2" size={16} />} onClick={() => open('delete')} />
      </ButtonGroup>
      <ActionHint hint={SPRITE_HINTS.more}>
        <ActionsMenu groups={groups} />
      </ActionHint>
    </Flex>
  );
};

export { SpritesToolbar };
