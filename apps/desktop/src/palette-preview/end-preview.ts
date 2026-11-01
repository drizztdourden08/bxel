/* @layer renderer-app @kind logic */
import { usePreviewBankStore } from '../stores/usePreviewBankStore';

const endPreview = (): void => usePreviewBankStore.getState().end();

export { endPreview };
