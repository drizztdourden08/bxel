/* @layer renderer-app @kind logic */
import { useViewFeedStore } from '../../../stores/useViewFeedStore';

const subscribeView = (notify: () => void): (() => void) => useViewFeedStore.subscribe(notify);

export { subscribeView };
