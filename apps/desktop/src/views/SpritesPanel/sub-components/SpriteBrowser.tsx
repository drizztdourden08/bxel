/* @layer renderer-app @kind component */
import { Box, ContextMenu, Stack } from '@drizztdourden08/tessera';
import { FOCUS_ZONE } from '../../../editor/focus/focus-zone.constants';
import type { ManagerDialog } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { renameSprite } from '../../../sheet/rename-sprite';
import { useManagerStore } from '../../../stores/useManagerStore';
import { usePendingStore } from '../../../stores/usePendingStore';
import { actionGroups } from '../behavior/action-groups';
import { handlersFor } from '../behavior/handlers-for';
import { useSpriteDrag } from '../behavior/useSpriteDrag';
import { useSpriteRename } from '../behavior/useSpriteRename';
import { useSpritesKeys } from '../behavior/useSpritesKeys';
import { NO_SPRITES } from '../SpritesPanel.constants';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { ManagerFilters } from './ManagerFilters';
import { SpriteCollection } from './SpriteCollection';
import { SpriteRename } from './SpriteRename';
import { SpritesToolbar } from './SpritesToolbar';

const SpriteBrowser = ({ model }: ManagerModelProps) => {
  const rename = useSpriteRename();
  const sortKey = useManagerStore((state) => state.sortKey);
  const patch = useManagerStore((state) => state.patch);
  const affected = usePendingStore((state) => state.pending?.sprites ?? NO_SPRITES);
  const open = (dialog: ManagerDialog): void => patch({ dialog });
  const onKeyDown = useSpritesKeys(model, { begin: rename.begin, open });
  const dragFor = useSpriteDrag(model);
  const groups = actionGroups({ model, sortKey, rename: rename.begin, open });
  const renaming = model.scene.sprites.find((sprite) => sprite.id === rename.renamingId);
  return (
    <Stack gap="sm">
      <ManagerFilters model={model} />
      <SpritesToolbar model={model} groups={groups} open={open} />
      <ContextMenu groups={groups} label={MANAGER_TEXT.actions}>
        <Box onKeyDown={onKeyDown} data-focus-zone={FOCUS_ZONE.sprites}>
          <SpriteCollection model={model} affected={affected} dragFor={dragFor} handlersFor={handlersFor(model, rename.begin)} />
        </Box>
      </ContextMenu>
      {renaming && (
        <SpriteRename
          key={renaming.id}
          spriteName={renaming.name}
          onCancel={rename.finish}
          onCommit={(name) => {
            if (renameSprite(renaming.id, name)) rename.finish();
          }}
        />
      )}
    </Stack>
  );
};

export { SpriteBrowser };
