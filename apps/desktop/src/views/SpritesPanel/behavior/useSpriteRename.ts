/* @layer renderer-app @kind hook */
import { useSpriteStore } from '../../../stores/useSpriteStore';
import type { SpriteRenameState } from '../SpritesPanel.type';

const useSpriteRename = (): SpriteRenameState => {
  const renamingId = useSpriteStore((state) => state.renamingId);
  const setRenaming = useSpriteStore((state) => state.setRenaming);
  return { renamingId, begin: setRenaming, finish: () => setRenaming(null) };
};

export { useSpriteRename };
