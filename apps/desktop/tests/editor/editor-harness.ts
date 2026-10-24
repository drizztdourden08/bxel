/* @layer renderer-app @kind test */
import { counterIdSource, flattenFrame } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { createDocumentHost } from '../../src/documents/create-document-host';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { activeTarget } from '../../src/editor/active-target';
import type { BrushOptions, EditorTarget } from '../../src/editor/editor.type';

const plainOptions: BrushOptions = { brush: { shape: 'square', size: 1 }, pixelPerfect: false, symmetry: {} };

interface OpenEditor {
  host: DocumentHost;
  documentId: DocumentId;
  target: () => EditorTarget;
  pixels: () => Uint8Array;
}

const openEditor = (): OpenEditor => {
  const host = createDocumentHost({ ids: counterIdSource() });
  const documentId = createDefaultArtwork(host);
  const target = (): EditorTarget => {
    const found = activeTarget(host.view(documentId));
    if (!found) throw new Error('the editor has no target');
    return found;
  };
  return { host, documentId, target, pixels: () => flattenFrame(target().sprite, target().frameId) };
};

export { openEditor, plainOptions };
export type { OpenEditor };
