/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import { focusTab } from '../workspace/focus-tab';
import { tabOf } from '../workspace/tab-of';

const showLinked = (documentId: DocumentId, key: AssetKey): void => focusTab(tabOf(documentId, key));

export { showLinked };
