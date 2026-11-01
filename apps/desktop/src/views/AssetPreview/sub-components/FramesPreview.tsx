/* @layer renderer-app @kind component */
import { useState } from 'react';
import { tagFrames } from '../../../asset-overview/tag-frames';
import type { FramesPreviewProps } from '../AssetPreview.type';
import { FramesPlayer } from './FramesPlayer';

const FramesPreview = ({ frames, name, loop, mode, tags }: FramesPreviewProps) => {
  const [tagId, setTagId] = useState<string | null>(null);
  const active = tags.find((tag) => tag.id === tagId);
  const shown = tagFrames(frames, active);
  const shownLoop = active ? { direction: active.direction, repeat: active.repeat } : loop;
  return <FramesPlayer key={active?.id ?? ''} frames={shown} name={name} loop={shownLoop} mode={mode} tags={tags} tagId={active?.id ?? null} onTag={setTagId} />;
};

export { FramesPreview };
