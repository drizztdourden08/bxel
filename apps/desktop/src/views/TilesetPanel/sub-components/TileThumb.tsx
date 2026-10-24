/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useTileThumb } from '../behavior/useTileThumb';
import type { TileThumbProps } from '../TilesetPanel.type';

const TileThumb = ({ artwork, sprite }: TileThumbProps) => {
  const canvas = useTileThumb(artwork, sprite);
  return <Canvas ref={canvas} className="tileset-panel__thumb" aria-hidden="true" />;
};

export { TileThumb };
