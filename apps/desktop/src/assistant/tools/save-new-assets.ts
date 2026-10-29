/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { assetKeys } from '../../workspace/asset-keys';
import { keyId } from '../../workspace/key-id';
import { saveTab } from '../../workspace/save-tab';
import { tabOf } from '../../workspace/tab-of';
import type { ToolContext } from '../assistant.type';
import { toolKit } from './tool-kit';

const saveNewAssets = async (context: ToolContext, documentId: DocumentId, before: ReadonlySet<string>): Promise<readonly string[] | string> => {
  const artwork = context.host.view(documentId)?.state.artwork;
  const fresh = (artwork ? assetKeys(artwork) : []).filter((key) => !before.has(keyId(key)));
  const paths = new Set<string>();
  for (const key of fresh) {
    const outcome = await saveTab(toolKit(context), tabOf(documentId, key), false);
    if (outcome.kind === 'done') paths.add(outcome.path);
    else if (outcome.kind === 'failed') return outcome.message;
  }
  return [...paths];
};

export { saveNewAssets };
