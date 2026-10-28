/* @layer renderer-app @kind logic */
import { confirmAction, toast } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { fileName } from '../files/file-name';
import { reasonOf } from '../files/reason-of';
import { useFileStore } from '../stores/useFileStore';
import { toSlashes } from '../workspace/to-slashes';
import { FILE_OPS_TEXT } from './file-ops.constants';
import { heldAssetsUnder } from './held-assets';
import { referrersOutside } from './referrers-outside';

const sentence = (paths: readonly string[]): string => {
  const others = referrersOutside(paths.flatMap(heldAssetsUnder)).length;
  const first = FILE_OPS_TEXT.trashMessage(paths.length, fileName(paths[0] ?? ''));
  return others === 0 ? first : `${first} ${FILE_OPS_TEXT.trashReferrers(others)}`;
};

const trashEntries = async (paths: readonly string[]): Promise<boolean> => {
  const kit = fileKit();
  const wanted = paths.map(toSlashes);
  if (!kit || wanted.length === 0) return false;
  const sure = await confirmAction({ title: FILE_OPS_TEXT.trashTitle, message: sentence(wanted), confirmLabel: FILE_OPS_TEXT.trashConfirm, cancelLabel: FILE_OPS_TEXT.cancel, variant: 'danger' });
  if (!sure) return false;
  try {
    for (const path of wanted) {
      await kit.documents.trash(path);
      useFileStore.getState().retarget(path, null);
    }
    toast(FILE_OPS_TEXT.trashed(wanted.length, fileName(wanted[0] ?? '')), { variant: 'success' });
    return true;
  } catch (error) {
    toast(reasonOf(error), { variant: 'danger' });
    return false;
  }
};

export { trashEntries };
