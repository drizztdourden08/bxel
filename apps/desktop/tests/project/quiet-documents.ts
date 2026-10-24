/* @layer renderer-app @kind test */
import type { DocumentsPort } from '@drizztdourden08/brock-core';

type QuietMethods =
  | 'clearRecent'
  | 'snapshot'
  | 'recoverable'
  | 'restoreSnapshot'
  | 'discardSnapshot'
  | 'revokeFolder'
  | 'trash'
  | 'rename'
  | 'mkdir'
  | 'watch'
  | 'rememberedFolders'
  | 'regrant'
  | 'forgetFolder'
  | 'reveal';

const quietDocuments: Pick<DocumentsPort, QuietMethods> = {
  clearRecent: () => Promise.resolve(),
  snapshot: () => Promise.resolve(),
  recoverable: () => Promise.resolve([]),
  restoreSnapshot: () => Promise.resolve(null),
  discardSnapshot: () => Promise.resolve(),
  revokeFolder: () => Promise.resolve(false),
  trash: () => Promise.resolve(),
  rename: () => Promise.resolve(),
  mkdir: () => Promise.resolve(),
  watch: () => Promise.resolve(() => undefined),
  rememberedFolders: () => Promise.resolve([]),
  regrant: (path) => Promise.reject(new Error(`"${path}" is not remembered`)),
  forgetFolder: () => Promise.resolve(false),
  reveal: () => Promise.resolve({ revealed: true }),
};

export { quietDocuments };
