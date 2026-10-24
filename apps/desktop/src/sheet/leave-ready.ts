/* @layer renderer-app @kind logic */
import { hasPreview } from '../editor/pending/has-preview';
import { useSpriteStore } from '../stores/useSpriteStore';

const leaveReady = (): boolean => {
  const sprites = useSpriteStore.getState();
  return !hasPreview() && (sprites.sliceDraw || (sprites.isolated && sprites.mode === 'sprite'));
};

export { leaveReady };
