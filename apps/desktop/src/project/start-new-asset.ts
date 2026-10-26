/* @layer renderer-app @kind logic */
import type { CreatableKind } from '../stores/creation-store.type';
import { useCreateDialogStore } from '../stores/useCreateDialogStore';

const startNewAsset = (kind: CreatableKind, dir?: string): void => useCreateDialogStore.getState().show(kind === 'sprite' ? 'sprite' : 'file', kind, dir);

export { startNewAsset };
