/* @layer renderer-app @kind logic */
import type { LayerId, TransactionOk } from '@bxel/document';
import { useToolStore } from '../stores/useToolStore';
import { LAYER_REF } from './layer-text.constants';

const selectCreated = (done: TransactionOk): void => {
  const created = done.created[LAYER_REF];
  if (created !== undefined) useToolStore.getState().setLayer(created as LayerId);
};

export { selectCreated };
