/* @layer renderer-app @kind logic */
import { useEntryDragStore } from '../stores/useEntryDragStore';

const endEntryDrag = (): void => {
  useEntryDragStore.getState().finish();
};

export { endEntryDrag };
