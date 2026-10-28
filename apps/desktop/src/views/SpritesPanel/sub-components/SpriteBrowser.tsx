/* @layer renderer-app @kind component */
import { commandZone, useContextMenu } from '@drizztdourden08/brock-react';
import { Box, SplitPane, Stack } from '@drizztdourden08/tessera';
import type { DataTableHandle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { useZoneKey } from '../../../hooks/useZoneKey';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { SPRITE_ADD_KEY, SPRITE_SEARCH_KEY, SPRITE_SELECT_ALL_KEY } from '../../../keymap/zone-key.constants';
import type { ManagerDialog } from '../../../sheet-manager/manager.type';
import { renameSprite } from '../../../sheet/rename-sprite';
import { selectEntries } from '../../../sheet-manager/select-ids';
import { SHEET_TEXT } from '../../../sheet-manager/sheet-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import { usePendingStore } from '../../../stores/usePendingStore';
import { actionGroups } from '../behavior/action-groups';
import { spriteMenuEntries } from '../behavior/sprite-menu-entries';
import { handlersFor } from '../behavior/handlers-for';
import { useSpriteDrag } from '../behavior/useSpriteDrag';
import { useSpriteRename } from '../behavior/useSpriteRename';
import { useSpritesKeys } from '../behavior/useSpritesKeys';
import { NO_SPRITES, SPRITE_MENU } from '../SpritesPanel.constants';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { BatchBar } from './BatchBar';
import { DrawerDropBar } from './DrawerDropBar';
import { LayoutSection } from './LayoutSection';
import { LibraryDrawer } from './LibraryDrawer';
import { ManagerFilters } from './ManagerFilters';
import { SheetTitle } from './SheetTitle';
import { SpriteCollection } from './SpriteCollection';
import { SpriteRename } from './SpriteRename';
import { ruledEntries } from '../../../context-menu/ruled-entries';

const SpriteBrowser = ({ model }: ManagerModelProps) => {
  const rename = useSpriteRename();
  const table = useRef<DataTableHandle>(null);
  const root = useRef<HTMLElement>(null);
  const sortKey = useManagerStore((state) => state.sortKey);
  const request = useManagerStore((state) => state.libraryRequest);
  const patch = useManagerStore((state) => state.patch);
  const affected = usePendingStore((state) => state.pending?.sprites ?? NO_SPRITES);
  const open = (dialog: ManagerDialog): void => patch({ dialog });
  const strips = model.animations.map((fact) => fact.key);
  useZoneKey(SPRITE_SELECT_ALL_KEY, model.scene.active ? () => selectEntries(model.order, strips) : null);
  useZoneKey(SPRITE_SEARCH_KEY, () => root.current?.querySelector<HTMLInputElement>('.sprites-panel__filters input')?.focus());
  useZoneKey(SPRITE_ADD_KEY, () => patch({ libraryRequest: Date.now() }));
  const onKeyDown = useSpritesKeys(model, table);
  const drag = useSpriteDrag(model);
  const selections = useManagerStore((state) => state.selections);
  useContextMenu(COMMAND_ZONE.sprites, { label: SPRITE_MENU.label, entries: ruledEntries(spriteMenuEntries) });
  const groups = actionGroups({ model, sortKey, rename: rename.begin, open, selections });
  const renaming = model.scene.sprites.find((sprite) => sprite.id === rename.renamingId);
  const body = (
    <Stack gap="xs" className="sprites-panel__main">
      <BatchBar model={model} groups={groups} open={open} />
      <Box onKeyDown={onKeyDown} className="sprites-panel__zone" {...commandZone(COMMAND_ZONE.sprites)} {...drag.zone}>
        <SpriteCollection model={model} table={table} affected={affected} dragFor={drag.dragFor} marks={drag.marks} handlersFor={handlersFor(model, rename.begin)} />
      </Box>
      <LayoutSection model={model} />
    </Stack>
  );
  return (
    <Box className="sprites-panel__browser" ref={root}>
      <SheetTitle model={model} />
      <ManagerFilters model={model} />
      <SplitPane
        key={request}
        orientation="vertical"
        defaultRatio={0.65}
        minRatio={0.25}
        collapsible
        defaultCollapsed={request === 0 ? 'end' : 'none'}
        startLabel={SHEET_TEXT.titleLabel}
        endLabel={SHEET_TEXT.library.label(model.library.sprites.length + model.library.animations.length)}
        className="sprites-panel__split"
        start={body}
        end={<LibraryDrawer model={model} />}
      />
      <DrawerDropBar model={model} />
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
    </Box>
  );
};

export { SpriteBrowser };
