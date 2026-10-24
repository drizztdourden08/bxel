/* @layer renderer-app @kind test */
import type { DocumentsPort } from '@drizztdourden08/brock-core';

const quietDocuments: Pick<DocumentsPort, 'clearRecent' | 'snapshot' | 'recoverable' | 'restoreSnapshot' | 'discardSnapshot'> = {
  clearRecent: () => Promise.resolve(),
  snapshot: () => Promise.resolve(),
  recoverable: () => Promise.resolve([]),
  restoreSnapshot: () => Promise.resolve(null),
  discardSnapshot: () => Promise.resolve(),
};

export { quietDocuments };
