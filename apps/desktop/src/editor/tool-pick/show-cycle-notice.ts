/* @layer renderer-app @kind logic */
import { useCycleNoteStore } from '../../stores/useCycleNoteStore';
import { CYCLE_NOTICE_MS } from './show-cycle-notice.constants';

let timer: ReturnType<typeof setTimeout> | null = null;

const showCycleNotice = (text: string): void => {
  if (timer !== null) clearTimeout(timer);
  useCycleNoteStore.getState().set(text);
  timer = setTimeout(() => {
    timer = null;
    useCycleNoteStore.getState().set(null);
  }, CYCLE_NOTICE_MS);
};

export { showCycleNotice };
