/* @layer renderer-app @kind component */
import { PixelThumbnail } from '@drizztdourden08/tessera';
import { thumbBox } from '../../../pixel-thumb/thumb-box';
import { animationClip } from '../behavior/animation-clip';
import type { AnimationThumbProps } from '../EntryTile.type';

const AnimationThumb = ({ artwork, animation, tagId, box, playing }: AnimationThumbProps) => (
  <PixelThumbnail frames={animationClip(artwork, animation, tagId)} playing={playing} box={thumbBox(box)} lazy />
);

export { AnimationThumb };
