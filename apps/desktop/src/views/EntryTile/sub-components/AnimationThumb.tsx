/* @layer renderer-app @kind component */
import { Canvas } from '@drizztdourden08/tessera';
import { useAnimationThumb } from '../behavior/useAnimationThumb';
import type { AnimationThumbProps } from '../EntryTile.type';

const AnimationThumb = (props: AnimationThumbProps) => {
  const canvas = useAnimationThumb(props);
  return <Canvas ref={canvas} className="entry-tile__thumb" aria-hidden="true" data-playing={props.playing ? 'true' : 'false'} />;
};

export { AnimationThumb };
