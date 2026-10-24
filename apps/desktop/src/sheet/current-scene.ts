/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useSpriteStore } from '../stores/useSpriteStore';
import type { SpriteScene } from './sheet.type';
import { spriteScene } from './sprite-scene';

const currentScene = (): SpriteScene | null => {
  const { host, activeId } = useDocumentStore.getState();
  const view = activeId === null ? null : host.view(activeId);
  if (!view) return null;
  const { activeId: spriteId, selected } = useSpriteStore.getState();
  return spriteScene(view.state.artwork, { activeId: spriteId, selected });
};

export { currentScene };
