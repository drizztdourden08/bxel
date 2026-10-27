/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import { fileName } from '../files/file-name';
import type { FileKit } from '../files/files.type';
import { parentOf } from './parent-of';
import { pathOwnedElsewhere } from './path-owned-elsewhere';
import { PICK_TEXT } from './pick-path.constants';
import type { OpenTab, PickedPath } from './workspace.type';

const fileExists = async (documents: FileKit['documents'], path: string): Promise<boolean> => {
  const listing = await documents.list(parentOf(path)).catch(() => ({ entries: [] }));
  return listing.entries.some((entry) => isSamePath(entry.path, path));
};

const vetPickedPath = async (kit: Pick<FileKit, 'documents' | 'prompts'>, owner: Pick<OpenTab, 'documentId' | 'key'>, picked: PickedPath): Promise<boolean> => {
  if (pathOwnedElsewhere(owner.documentId, owner.key, picked.path)) {
    toast(PICK_TEXT.owned(fileName(picked.path)), { variant: 'warning' });
    return false;
  }
  if (isSamePath(picked.chosen, picked.path) || !(await fileExists(kit.documents, picked.path))) return true;
  return kit.prompts.confirm({
    title: PICK_TEXT.replaceTitle,
    message: PICK_TEXT.replaceMessage(fileName(picked.path)),
    confirmLabel: PICK_TEXT.replaceConfirm,
    cancelLabel: PICK_TEXT.replaceCancel,
    variant: 'danger',
  });
};

export { vetPickedPath };
