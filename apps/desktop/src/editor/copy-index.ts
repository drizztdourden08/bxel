/* @layer renderer-app @kind logic */
import { toast, writeClipboard } from '@drizztdourden08/brock-react';
import { useReadoutStore } from '../stores/useReadoutStore';
import { currentTarget } from './current-target';
import { samplePixel } from './sample-pixel';
import { STATUS_TEXT } from './status.constants';

const copyIndex = async (): Promise<void> => {
  const { pointer } = useReadoutStore.getState();
  const target = currentTarget();
  const index = pointer && target ? samplePixel(target, pointer) : null;
  if (index === null) {
    toast(STATUS_TEXT.noCursor, { variant: 'info' });
    return;
  }
  const copied = await writeClipboard(String(index));
  toast(copied ? STATUS_TEXT.indexCopied : STATUS_TEXT.indexFailed, { variant: copied ? 'success' : 'danger' });
};

export { copyIndex };
