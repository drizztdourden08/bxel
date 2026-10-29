/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement, DropInfo } from '@drizztdourden08/brock-react';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { addImageFiles } from '../../../add-frames/add-image-files';
import { dropIndex } from '../../../add-frames/drop-index';
import { dropSprite } from '../../../add-frames/drop-sprite';
import { DROP_REFUSAL_MS } from '../../../add-frames/image-drop.constants';
import { ASSET_DRAG } from '../../../asset-drag/asset-drag.constants';
import type { AnimationFocus } from '../../../timeline/timeline.type';
import type { TrackPayload } from './useTrackDrop.type';

const spritesOf = (payload: TrackPayload): readonly string[] =>
  'files' in payload ? [] : payload.flatMap((asset) => (asset.kind === 'sprite' && asset.assetId !== null ? [asset.assetId] : []));

const atOf = (info: DropInfo, focus: AnimationFocus): number => info.index ?? focus.animation.frames.length;

const useTrackDrop = (ref: RefObject<DndElement | null>, focus: AnimationFocus): string | null => {
  const [refused, setRefused] = useState<string | null>(null);
  useDropTarget<TrackPayload>(ref, {
    accepts: [dnd.files, ASSET_DRAG],
    canDrop: (payload) => 'files' in payload || (!focus.readOnly && spritesOf(payload).length > 0),
    index: (point, element) => dropIndex(document.elementFromPoint(point.x, point.y) ?? element, point.x, focus),
    onDrop: (payload, info) => {
      if (!('files' in payload)) {
        spritesOf(payload).forEach((id, offset) => dropSprite(id, atOf(info, focus) + offset, false));
        return;
      }
      const earlier = payload.rejected.map((each) => `${each.name} was not added. ${each.reason}`);
      void addImageFiles(
        payload.files.map((each) => each.file),
        atOf(info, focus),
        earlier,
      ).then((reasons) => setRefused(reasons.length > 0 ? reasons.join(' ') : null));
    },
  });
  useEffect(() => {
    if (refused === null) return undefined;
    const timer = window.setTimeout(() => setRefused(null), DROP_REFUSAL_MS);
    return () => window.clearTimeout(timer);
  }, [refused]);
  return refused;
};

export { useTrackDrop };
