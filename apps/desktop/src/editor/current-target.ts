/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { activeTarget } from './active-target';
import { editSpriteId } from './edit-sprite-id';
import type { EditorTarget } from './editor.type';

const currentTarget = (): EditorTarget | null => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  const sprites = useSpriteStore.getState();
  const tiles = useTilemapStore.getState();
  const spriteId = editSpriteId(sprites.mode, tiles.editMode, tiles.editSpriteId, sprites.activeId);
  return activeTarget(view, useToolStore.getState().layerId, spriteId, useTimelineStore.getState().frameId);
};

export { currentTarget };
