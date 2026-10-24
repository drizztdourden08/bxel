/* @layer renderer-app @kind component */
import { Box, DropdownMenu, Stack } from '@drizztdourden08/tessera';
import { FOCUS_ZONE } from '../../../editor/focus/focus-zone.constants';
import { renameSprite } from '../../../sheet/rename-sprite';
import { useManagerStore } from '../../../stores/useManagerStore';
import { usePendingStore } from '../../../stores/usePendingStore';
import { actionGroups } from '../behavior/action-groups';
import { handlersFor } from '../behavior/handlers-for';
import { useContextMenu } from '../behavior/useContextMenu';
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
  const menu = useContextMenu();
  const sortKey = useManagerStore((state) => state.sortKey);
  const patch = useManagerStore((state) => state.patch);
  const affected = usePendingStore((state) => state.pending?.sprites ?? NO_SPRITES);
  const onKeyDown = useSpritesKeys(model, rename.begin);
  const dragFor = useSpriteDrag(model);
  const groups = actionGroups({ model, sortKey, rename: rename.begin, open: (dialog) => patch({ dialog }) });
  const renaming = model.scene.sprites.find((sprite) => sprite.id === rename.renamingId);
  return (
    <Stack gap="sm">
      <ManagerFilters model={model} />
      <SpritesToolbar model={model} groups={groups} />
      <Box onKeyDown={onKeyDown} data-focus-zone={FOCUS_ZONE.sprites}>
        <SpriteCollection model={model} affected={affected} dragFor={dragFor} handlersFor={handlersFor(model, rename.begin, menu)} />
      </Box>
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
      {menu.open && <DropdownMenu groups={groups} anchorRef={menu.anchor} onClose={menu.hide} />}
    </Stack>
  );
};

export { SpriteBrowser };
