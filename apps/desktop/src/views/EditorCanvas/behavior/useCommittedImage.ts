/* @layer renderer-app @kind hook */
import { useEffect, useMemo } from 'react';
import type { RefObject } from 'react';
import { committedImage } from '../../../editor/committed-image';
import type { EditorTarget } from '../../../editor/editor.type';
import { useReferenceStore } from '../../../stores/useReferenceStore';
import { takeRepaint } from '../../../editor/take-repaint';
import type { PixelViewportHandle } from '../../PixelViewport';

const useCommittedImage = (target: EditorTarget | null, viewport: RefObject<PixelViewportHandle | null>): ImageData | null => {
  const references = useReferenceStore((state) => state.entries);
  const image = useMemo(() => (target ? committedImage(target) : null), [target, references]);
  useEffect(() => {
    if (takeRepaint()) viewport.current?.redraw();
  }, [image, target, viewport]);
  return image;
};

export { useCommittedImage };
