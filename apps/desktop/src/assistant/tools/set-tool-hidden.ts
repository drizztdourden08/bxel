/* @layer renderer-app @kind logic */
import { useToolPrefsStore } from '../../stores/useToolPrefsStore';

const setToolHidden = (memberId: string, hidden: boolean): void => {
  const state = useToolPrefsStore.getState();
  if (state.hiddenMembers.includes(memberId) !== hidden) state.toggleHidden(memberId);
};

export { setToolHidden };
