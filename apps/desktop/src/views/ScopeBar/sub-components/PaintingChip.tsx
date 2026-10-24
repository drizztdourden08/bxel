/* @layer renderer-app @kind component */
import { Tag } from '@drizztdourden08/tessera';
import { useSpriteScene } from '../../../hooks/useSpriteScene';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { SCOPE_TEXT } from '../ScopeBar.constants';

const PaintingChip = () => {
  const model = useSpriteScene();
  const broadcast = useSpriteStore((state) => state.broadcast);
  const count = model?.scene.selected.length ?? 0;
  if (!broadcast || count < 2) return null;
  return <Tag variant="urgency" color="warning">{SCOPE_TEXT.painting(count)}</Tag>;
};

export { PaintingChip };
