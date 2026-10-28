/* @layer renderer-app @kind logic */
import { useImportStore } from '../../../stores/useImportStore';
import type { ImageTab } from '../../../stores/image-tab-store.type';

const importImageTab = (tab: ImageTab): void => useImportStore.getState().show(tab.image);

export { importImageTab };
