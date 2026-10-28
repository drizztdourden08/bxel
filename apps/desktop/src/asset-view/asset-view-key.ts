/* @layer renderer-app @kind logic */
import { keyId } from '../workspace/key-id';
import type { OpenTab } from '../workspace/workspace.type';

const assetViewKeyOf = (tab: OpenTab | null): string | null => (tab ? `${tab.documentId}/${keyId(tab.key)}` : null);

export { assetViewKeyOf };
