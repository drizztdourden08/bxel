/* @layer renderer-app @kind logic */
import { animationFocus } from '../timeline/animation-focus';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import { useTilemapStore } from '../stores/useTilemapStore';
import { useTimelineStore } from '../stores/useTimelineStore';
import { useToolStore } from '../stores/useToolStore';
import { currentTab } from '../workspace/current-tab';
import { activeTarget } from './active-target';
import { animationTarget } from './animation-target';
import { editSpriteId } from './edit-sprite-id';
import type { EditorTarget } from './editor.type';

const currentTarget = (): EditorTarget | null => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  const layerId = useToolStore.getState().layerId;
  const tab = currentTab();
  if (tab?.key.kind === 'animation') {
    const focus = animationFocus(view, tab, useTimelineStore.getState().frameId);
    return view && focus ? animationTarget(view, focus, layerId) : null;
  }
  const sprites = useSpriteStore.getState();
  const tiles = useTilemapStore.getState();
  const spriteId = editSpriteId(sprites.mode, tiles.editMode, tiles.editSpriteId, sprites.activeId);
  return activeTarget(view, layerId, spriteId);
};

export { currentTarget };
