/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement, DroppedFiles } from '@drizztdourden08/brock-react';
import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { addImageFiles } from '../../../add-frames/add-image-files';
import { dropIndex } from '../../../add-frames/drop-index';
import { DROP_REFUSAL_MS } from '../../../add-frames/image-drop.constants';
import type { AnimationFocus } from '../../../timeline/timeline.type';

const useFileDrop = (ref: RefObject<DndElement | null>, focus: AnimationFocus): string | null => {
  const [refused, setRefused] = useState<string | null>(null);
  useDropTarget<DroppedFiles>(ref, {
    accepts: dnd.files,
    index: (point, element) => dropIndex(document.elementFromPoint(point.x, point.y) ?? element, point.x, focus),
    onDrop: (dropped, info) => {
      const earlier = dropped.rejected.map((each) => `${each.name} was not added. ${each.reason}`);
      void addImageFiles(
        dropped.files.map((each) => each.file),
        info.index ?? focus.animation.frames.length,
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

export { useFileDrop };
