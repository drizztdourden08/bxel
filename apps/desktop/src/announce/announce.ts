/* @layer renderer-app @kind logic */
import { useAnnounceStore } from '../stores/useAnnounceStore';

const announce = (text: string): void => useAnnounceStore.getState().say(text);

export { announce };
