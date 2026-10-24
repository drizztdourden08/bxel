/* @layer renderer-app @kind component */
import { EmptyState } from '@drizztdourden08/tessera';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { useManagerStore } from '../../../stores/useManagerStore';
import type { SpriteViewProps } from '../SpritesPanel.type';
import { SpriteGrid } from './SpriteGrid';
import { SpriteList } from './SpriteList';

const SpriteCollection = (props: SpriteViewProps) => {
  const view = useManagerStore((state) => state.view);
  const zoom = useManagerStore((state) => state.zoom);
  if (props.model.shown.length === 0) return <EmptyState message={MANAGER_TEXT.noMatch} />;
  return view === 'grid' ? <SpriteGrid {...props} box={zoom} /> : <SpriteList {...props} />;
};

export { SpriteCollection };
