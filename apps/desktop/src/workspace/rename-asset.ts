/* @layer renderer-app @kind logic */
import type { AssetKey, DocumentId } from '@bxel/document';
import type { DocumentHost } from '../documents/document-host.type';
import { runSteps } from '../transactions/run-steps';
import { assetName } from './asset-name';
import { RENAME_LABEL, RENAME_STEP } from './rename-steps.constants';

const renameAsset = (host: DocumentHost, documentId: DocumentId, key: AssetKey, name: string): boolean => {
  const view = host.view(documentId);
  const step = RENAME_STEP[key.kind];
  const current = view ? assetName(view.state.artwork, key) : null;
  if (!view || !step || current === null || view.state.readOnly) return false;
  if (current === name) return true;
  return runSteps(host, documentId, RENAME_LABEL, [step(key.id, name)]).ok;
};

export { renameAsset };
