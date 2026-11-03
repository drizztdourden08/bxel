/* @layer renderer-app @kind component */
import { PixelPlayer } from '@drizztdourden08/tessera';
import { useMemo, useState } from 'react';
import { playerFrames } from '../../../asset-preview/player-frames';
import { playerTags, tagLoop } from '../../../asset-preview/player-tags';
import type { FramesPreviewProps } from '../AssetPreview.type';

const FramesPreview = ({ frames, name, loop, tags }: FramesPreviewProps) => {
  const [tagId, setTagId] = useState<string | null>(null);
  const shown = useMemo(() => playerFrames(frames), [frames]);
  const ranges = useMemo(() => playerTags(tags), [tags]);
  const active = tags.find((tag) => tag.id === tagId);
  const playing = active ? tagLoop(active) : loop;
  return <PixelPlayer className="asset-preview__player" label={name} frames={shown} loop={playing} tags={ranges} tagId={active?.id ?? null} onTagChange={setTagId} />;
};

export { FramesPreview };
