/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useThumbnail } from '../behavior/useThumbnail';
import type { SpriteThumbProps } from '../SpritesPanel.type';

const SpriteThumb = ({ image }: SpriteThumbProps) => {
  const canvas = useThumbnail(image);
  return <Canvas ref={canvas} className="sprites-panel__thumb" aria-hidden="true" />;
};

export { SpriteThumb };
