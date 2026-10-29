/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useTileThumb } from '../behavior/useTileThumb';
import type { TileThumbProps } from '../TilesetPanel.type';

const TileThumb = (props: TileThumbProps) => {
  const canvas = useTileThumb(props);
  return <Canvas ref={canvas} className="tileset-panel__thumb" aria-hidden="true" />;
};

export { TileThumb };
