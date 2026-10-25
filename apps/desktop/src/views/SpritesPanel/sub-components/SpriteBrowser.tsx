/* @layer renderer-app @kind component */
import { commandZone } from '@drizztdourden08/brock-react';
import { Box, ContextMenu, Stack } from '@drizztdourden08/tessera';
import { useZoneKey } from '../../../hooks/useZoneKey';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { SPRITE_SELECT_ALL_KEY } from '../../../keymap/zone-key.constants';
import type { ManagerDialog } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { renameSprite } from '../../../sheet/rename-sprite';
import { selectIds } from '../../../sheet-manager/select-ids';
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
  useZoneKey(SPRITE_SELECT_ALL_KEY, model.scene.active ? () => selectIds(model.order) : null);
  const onKeyDown = useSpritesKeys(model);
  const dragFor = useSpriteDrag(model);
  const selections = useManagerStore((state) => state.selections);
  const groups = actionGroups({ model, sortKey, rename: rename.begin, open, selections });
  const renaming = model.scene.sprites.find((sprite) => sprite.id === rename.renamingId);
  return (
    <Stack gap="xs" className="sprites-panel__browser">
      <SpritesToolbar model={model} groups={groups} open={open} />
      <ManagerFilters model={model} />
      <ContextMenu groups={groups} label={MANAGER_TEXT.actions}>
        <Box onKeyDown={onKeyDown} className="sprites-panel__zone" {...commandZone(COMMAND_ZONE.sprites)}>
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
