/* @layer renderer-app @kind hook */
import { frameToRgba } from '@bxel/document';
import { useMemo } from 'react';
import type { EditorTarget } from '../editor/editor.type';
import { draftBank } from '../palette-panel/draft-bank';
import { useSwatchDraftStore } from '../stores/useSwatchDraftStore';

const useSwatchDraftImage = (target: EditorTarget | null): ImageData | null => {
  const draft = useSwatchDraftStore((state) => state.draft);
  return useMemo(() => {
    if (!target || draft?.documentId !== target.documentId || draft.bankId !== target.bank.id) return null;
    const { sprite, frameId } = target;
    const rgba = frameToRgba(sprite, draftBank(target.bank, draft), frameId);
    return new ImageData(new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.length), sprite.width, sprite.height);
  }, [target, draft]);
};

export { useSwatchDraftImage };
