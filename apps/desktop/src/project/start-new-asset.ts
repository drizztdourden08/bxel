/* @layer renderer-app @kind logic */
import type { CreatableKind } from '../stores/creation-store.type';
import { useCreateDialogStore } from '../stores/useCreateDialogStore';

const startNewAsset = (kind: CreatableKind): void => useCreateDialogStore.getState().show(kind === 'sprite' ? 'sprite' : 'file', kind);

export { startNewAsset };
