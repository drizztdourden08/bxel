/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { frameToRgba } from '@bxel/document';
import type { EditorTarget } from '../../../editor/editor.type';

const useCommittedImage = (target: EditorTarget | null): ImageData | null =>
  useMemo(() => {
    if (!target) return null;
    const { sprite, bank, frameId } = target;
    const rgba = frameToRgba(sprite, bank, frameId);
    return new ImageData(new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.length), sprite.width, sprite.height);
  }, [target]);

export { useCommittedImage };
