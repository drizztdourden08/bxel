/* @layer renderer-app @kind component */
import { usePlayback } from '../../../asset-preview/usePlayback';
import type { FramesPlayerProps } from '../AssetPreview.type';
import { PixelStage } from './PixelStage';
import { PlaybackBar } from './PlaybackBar';

const FramesPlayer = ({ frames, name, loop, mode, tags, tagId, onTag }: FramesPlayerProps) => {
  const playback = usePlayback({ frames, loop });
  const shown = frames[playback.index] ?? frames[0];
  if (!shown) return null;
  return (
    <>
      <PixelStage image={shown.image} label={name} mode={mode} />
      {(frames.length > 1 || tags.length > 0) && <PlaybackBar playback={playback} total={frames.length} loop={loop} tags={tags} tagId={tagId} onTag={onTag} />}
    </>
  );
};

export { FramesPlayer };
