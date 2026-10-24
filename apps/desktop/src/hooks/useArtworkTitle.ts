/* @layer renderer-app @kind hook */
import { useDocumentTitle } from '@drizztdourden08/brock-react';
import { documentName } from '../files/document-name';
import { useFileStore } from '../stores/useFileStore';
import { useActiveDocument } from './useActiveDocument';

const useArtworkTitle = (): void => {
  const view = useActiveDocument();
  const path = useFileStore((state) => (view ? state.paths[view.state.documentId] : undefined));
  useDocumentTitle(view ? { name: documentName(view.state.artwork.name, path), dirty: !view.clean } : null);
};

export { useArtworkTitle };
