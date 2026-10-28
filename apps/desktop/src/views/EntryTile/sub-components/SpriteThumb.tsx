/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useThumbnail } from '../behavior/useThumbnail';
import type { SpriteThumbProps } from '../EntryTile.type';

const SpriteThumb = ({ artwork, sprite, box }: SpriteThumbProps) => {
  const canvas = useThumbnail(artwork, sprite, box);
  return <Canvas ref={canvas} className="entry-tile__thumb" aria-hidden="true" />;
};

export { SpriteThumb };
