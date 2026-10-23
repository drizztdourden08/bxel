/* @layer renderer-app @kind test */
import { counterIdSource, flattenFrame } from '@bxel/document';
import type { DocumentId } from '@bxel/document';
import { createDefaultProject } from '../../src/documents/create-default-project';
import { createDocumentHost } from '../../src/documents/create-document-host';
import type { DocumentHost } from '../../src/documents/document-host.type';
import { activeTarget } from '../../src/editor/active-target';
import type { EditorTarget } from '../../src/editor/editor.type';

interface OpenEditor {
  host: DocumentHost;
  documentId: DocumentId;
  target: () => EditorTarget;
  pixels: () => Uint8Array;
}

const openEditor = (): OpenEditor => {
  const host = createDocumentHost({ ids: counterIdSource() });
  const documentId = createDefaultProject(host);
  const target = (): EditorTarget => {
    const found = activeTarget(host.view(documentId));
    if (!found) throw new Error('the editor has no target');
    return found;
  };
  return { host, documentId, target, pixels: () => flattenFrame(target().sprite, target().frameId) };
};

export { openEditor };
export type { OpenEditor };
