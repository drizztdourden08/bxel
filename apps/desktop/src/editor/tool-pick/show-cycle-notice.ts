/* @layer renderer-app @kind logic */
import { dismissToast, toast } from '@drizztdourden08/brock-react';
import { CYCLE_NOTICE_MS } from './show-cycle-notice.constants';

let shown: string | null = null;

const showCycleNotice = (text: string): void => {
  if (shown !== null) dismissToast(shown);
  shown = toast(text, { variant: 'info', duration: CYCLE_NOTICE_MS });
};

export { showCycleNotice };
