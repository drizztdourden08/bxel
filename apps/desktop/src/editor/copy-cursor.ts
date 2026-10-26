/* @layer renderer-app @kind logic */
import { toast, writeClipboard } from '@drizztdourden08/brock-react';
import { useReadoutStore } from '../stores/useReadoutStore';
import { STATUS_TEXT } from './status.constants';

const copyCursor = async (): Promise<void> => {
  const { pointer } = useReadoutStore.getState();
  if (pointer === null) {
    toast(STATUS_TEXT.noCursor, { variant: 'info' });
    return;
  }
  const copied = await writeClipboard(STATUS_TEXT.cursor(pointer));
  toast(copied ? STATUS_TEXT.cursorCopied : STATUS_TEXT.cursorFailed, { variant: copied ? 'success' : 'danger' });
};

export { copyCursor };
