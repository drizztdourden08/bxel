/* @layer renderer-app @kind hook */
import { dnd, useDropTarget } from '@drizztdourden08/brock-react';
import type { DndElement, DroppedFiles } from '@drizztdourden08/brock-react';
import type { RefObject } from 'react';
import { addReferenceLayer } from '../../../editor/add-reference-layer';
import { isImageFile } from '../../../image-import/is-image-file';
import type { LayerStackModel } from '../LayerStack.type';

const imagePath = (payload: DroppedFiles): string | null => {
  const found = payload.files.find((each) => each.path !== null && isImageFile(each.file));
  return found?.path ?? null;
};

const useLayerFileDrop = (ref: RefObject<DndElement | null>, model: LayerStackModel): void => {
  const sprite = model.kind === 'sprite';
  useDropTarget<DroppedFiles>(ref, {
    accepts: [dnd.files],
    canDrop: (payload) => sprite && imagePath(payload) !== null,
    onDrop: (payload) => {
      const path = imagePath(payload);
      if (path !== null) addReferenceLayer(path);
    },
  });
};

export { useLayerFileDrop };
