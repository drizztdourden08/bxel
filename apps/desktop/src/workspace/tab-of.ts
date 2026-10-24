/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { keyId } from './key-id';
import { TAB_SEPARATOR } from './workspace.constants';
import type { OpenTab } from './workspace.type';

const tabOf = (documentId: DocumentId, key: AssetKey): OpenTab => ({
  id: `${documentId}${TAB_SEPARATOR}${keyId(key)}`,
  documentId,
  key: { kind: key.kind, id: key.id },
});

export { tabOf };
