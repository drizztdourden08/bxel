/* @layer renderer-app @kind hook */
import { useDocumentTitle } from '@drizztdourden08/brock-react';
import { documentName } from '../files/document-name';
import { titleInProject } from '../project/title-in-project';
import { useFileStore } from '../stores/useFileStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useActiveDocument } from './useActiveDocument';

const useArtworkTitle = (): void => {
  const view = useActiveDocument();
  const project = useProjectStore((state) => state.project);
  const path = useFileStore((state) => (view ? state.paths[view.state.documentId] : undefined));
  useDocumentTitle(view ? { name: titleInProject(documentName(view.state.artwork.name, path), path, project), dirty: !view.clean } : null);
};

export { useArtworkTitle };
