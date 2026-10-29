/* @layer renderer-app @kind component */
import { useAnimationFocus } from '../../hooks/useAnimationFocus';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useSpriteStore } from '../../stores/useSpriteStore';
import { EmptyTimeline } from './sub-components/EmptyTimeline';
import { TileTimeline } from './sub-components/TileTimeline';
import { TimelineView } from './sub-components/TimelineView';
import './TimelinePanel.css';

const TimelinePanel = () => {
  const focus = useAnimationFocus();
  const onMap = useSpriteStore((state) => state.mode === 'tilemap');
  const editing = useTilemapStore((state) => state.editMode === 'edit');
  if (focus) return <TimelineView focus={focus} />;
  return onMap && editing ? <TileTimeline /> : <EmptyTimeline />;
};

export { TimelinePanel };
