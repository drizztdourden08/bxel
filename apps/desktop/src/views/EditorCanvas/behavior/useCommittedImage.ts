/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { frameToRgba } from '@bxel/document';
import type { EditorTarget } from '../../../editor/editor.type';

const useCommittedImage = (target: EditorTarget | null): ImageData | null =>
  useMemo(() => {
    if (!target) return null;
    const { sprite, bank, frameId } = target;
    return new ImageData(Uint8ClampedArray.from(frameToRgba(sprite, bank, frameId)), sprite.width, sprite.height);
  }, [target]);

export { useCommittedImage };
