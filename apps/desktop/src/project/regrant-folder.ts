/* @layer renderer-app @kind logic */
import type { DocumentsPort } from '@drizztdourden08/brock-core';

const regrantFolder = (documents: DocumentsPort, root: string): Promise<string | null> =>
  documents.regrant(root).then(
    (path) => path,
    () => null,
  );

export { regrantFolder };
