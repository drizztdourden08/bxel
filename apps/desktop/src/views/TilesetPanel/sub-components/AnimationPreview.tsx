/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { TILE_ANIMATION_TEXT } from '../../../tile-animation/tile-animation.constants';
import { useAnimationPreview } from '../behavior/useAnimationPreview';
import type { AnimationPartProps } from '../TilesetPanel.type';

const AnimationPreview = ({ artwork, tileset, tile }: AnimationPartProps) => {
  const canvas = useAnimationPreview(artwork, tileset, tile);
  return <Canvas ref={canvas} className="tileset-panel__preview" role="img" aria-label={TILE_ANIMATION_TEXT.preview} />;
};

export { AnimationPreview };
