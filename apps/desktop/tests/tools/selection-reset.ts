/* @layer renderer-app @kind test */
import { SELECTION_DEFAULTS } from '../../src/stores/selection-store.constants';
import { useSelectionStore } from '../../src/stores/useSelectionStore';

const selectionStore = (): void => useSelectionStore.setState({ ...SELECTION_DEFAULTS });

export { selectionStore };
