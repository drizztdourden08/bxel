/* @layer renderer-app @kind component */
import { useContextMenu } from '@drizztdourden08/brock-react';
import { Box, Stack } from '@drizztdourden08/tessera';
import type { DataTableHandle } from '@drizztdourden08/tessera';
import { useRef } from 'react';
import { useZoneKey } from '../../../hooks/useZoneKey';
import { COMMAND_ZONE } from '../../../keymap/command-zone.constants';
import { SPRITE_ADD_KEY, SPRITE_COPY_KEY, SPRITE_CUT_KEY, SPRITE_PASTE_KEY, SPRITE_REMOVE_KEY, SPRITE_SEARCH_KEY, SPRITE_SELECT_ALL_KEY } from '../../../keymap/zone-key.constants';
import type { ManagerDialog } from '../../../sheet-manager/manager.type';
import { renameSprite } from '../../../sheet/rename-sprite';
import { useManagerStore } from '../../../stores/useManagerStore';
import { usePendingStore } from '../../../stores/usePendingStore';
import { actionGroups } from '../behavior/action-groups';
import { spriteMenuEntries } from '../behavior/sprite-menu-entries';
import { handlersFor } from '../behavior/handlers-for';
import { useSpriteDrag } from '../behavior/useSpriteDrag';
import { useSpriteRename } from '../behavior/useSpriteRename';
import { useSpritesKeys } from '../behavior/useSpritesKeys';
import { useWideShape } from '../behavior/useWideShape';
import { NO_SPRITES, SPRITE_MENU } from '../SpritesPanel.constants';
import type { ManagerModelProps } from '../SpritesPanel.type';
import { BatchBar } from './BatchBar';
import { DrawerDropBar } from './DrawerDropBar';
import { LayoutSection } from './LayoutSection';
import { BrowserSplit } from './BrowserSplit';
import { ManagerFilters } from './ManagerFilters';
import { SheetTitle } from './SheetTitle';
import { SheetZone } from './SheetZone';
import { SpriteCollection } from './SpriteCollection';
import { SpriteRename } from './SpriteRename';
import { ruledEntries } from '../../../context-menu/ruled-entries';
import { holdEntries } from '../../../sheet-manager/hold-entries';
import { pasteEntries } from '../../../sheet-manager/paste-entries';
import { removeEntries } from '../../../sheet-manager/remove-entries';
import { selectEntries } from '../../../sheet-manager/select-entries';

const SpriteBrowser = ({ model }: ManagerModelProps) => {
  const rename = useSpriteRename();
  const table = useRef<DataTableHandle>(null);
  const root = useRef<HTMLElement>(null);
  const wide = useWideShape(root);
  const sortKey = useManagerStore((state) => state.sortKey);
  const patch = useManagerStore((state) => state.patch);
  const affected = usePendingStore((state) => state.pending?.sprites ?? NO_SPRITES);
  const open = (dialog: ManagerDialog): void => patch({ dialog });
  const strips = model.animations.map((fact) => fact.key);
  useZoneKey(SPRITE_SELECT_ALL_KEY, model.scene.active ? () => selectEntries(model.order, strips) : null);
  useZoneKey(SPRITE_SEARCH_KEY, () => root.current?.querySelector<HTMLInputElement>('.sprites-panel__filters input')?.focus());
  useZoneKey(SPRITE_REMOVE_KEY, () => removeEntries(model.ids, model.picked, model.sheet?.id ?? null));
  useZoneKey(SPRITE_COPY_KEY, () => holdEntries(model.ids, model.picked, model.sheet?.id ?? null, false));
  useZoneKey(SPRITE_CUT_KEY, () => holdEntries(model.ids, model.picked, model.sheet?.id ?? null, true));
  useZoneKey(SPRITE_PASTE_KEY, () => void pasteEntries());
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
      <SheetZone model={model} onKeyDown={onKeyDown} onMark={drag.setMark}>
        <SpriteCollection model={model} table={table} affected={affected} dragFor={drag.dragFor} marks={drag.marks} handlersFor={handlersFor(model, rename.begin)} />
      </SheetZone>
      {!wide && <LayoutSection model={model} />}
    </Stack>
  );
  return (
    <Box className={`sprites-panel__browser${wide ? ' sprites-panel__browser--wide' : ''}`} ref={root}>
      <Box className="sprites-panel__head">
        <SheetTitle model={model} />
        <ManagerFilters model={model} />
      </Box>
      <BrowserSplit model={model} wide={wide} body={body} />
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
