/* @layer renderer-app @kind logic */
import { hasPreview } from '../editor/pending/has-preview';
import { useSpriteStore } from '../stores/useSpriteStore';

const enterReady = (): boolean => {
  const sprites = useSpriteStore.getState();
  return hasPreview() || (sprites.mode === 'sheet' && !sprites.sliceDraw);
};

export { enterReady };
