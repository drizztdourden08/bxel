/* @layer renderer-app @kind logic */
import { useNoticeStore } from '../stores/useNoticeStore';
import { usePendingStore } from '../stores/usePendingStore';
import { SHEET_TEXT } from './sheet.constants';

const busy = (): boolean => {
  const open = usePendingStore.getState().pending !== null;
  if (open) useNoticeStore.getState().post(SHEET_TEXT.pickBusy);
  return open;
};

export { busy };
