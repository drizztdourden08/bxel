/* @layer renderer-app @kind component */
import { useMapContext } from '../../../hooks/useMapContext';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { EmptyTimeline } from './EmptyTimeline';
import { TileAnimation } from './TileAnimation';

const TileTimeline = () => {
  const context = useMapContext();
  const editKey = useTilemapStore((state) => state.editKey);
  const tileset = context?.tileset ?? null;
  const tile = tileset?.tiles.find((each) => each.key === editKey);
  if (!context || !tileset || !tile) return <EmptyTimeline />;
  return <TileAnimation artwork={context.artwork} tileset={tileset} tile={tile} />;
};

export { TileTimeline };
