/* @layer renderer-app @kind hook */
import { findBank, frameToRgba } from '@bxel/document';
import { useEffect, useMemo } from 'react';
import type { EditorTarget } from '../editor/editor.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { usePreviewBankStore } from '../stores/usePreviewBankStore';

const usePreviewBankImage = (target: EditorTarget | null): ImageData | null => {
  const preview = usePreviewBankStore((state) => state.preview);
  const stale = preview !== null && (target?.documentId !== preview.documentId || target.revision !== preview.revision);
  useEffect(() => {
    if (stale) usePreviewBankStore.getState().end();
  }, [stale]);
  return useMemo(() => {
    if (!target || !preview || stale || preview.bankId !== target.bank.id) return null;
    const artwork = useDocumentStore.getState().host.view(target.documentId)?.state.artwork;
    const other = artwork ? findBank(artwork, preview.withBankId) : undefined;
    if (!other) return null;
    const { sprite, frameId } = target;
    const rgba = frameToRgba(sprite, other, frameId);
    return new ImageData(new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.length), sprite.width, sprite.height);
  }, [target, preview, stale]);
};

export { usePreviewBankImage };
