/* @layer renderer-app @kind logic */
import { SELECTION_COMMAND } from '@bxel/raster';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { commitRequest } from '../commit-request';
import { currentTarget } from '../current-target';
import { spriteScope } from '../sprite-scope';
import { SELECTION_LABELS } from './selection.constants';

const deleteSavedSelection = (name: string): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const step = { name: SELECTION_COMMAND.selectionDelete, options: { name } };
  const result = useDocumentStore.getState().host.execute(commitRequest(target, SELECTION_LABELS.forget(name), step, spriteScope(target)));
  if (!result.ok) useNoticeStore.getState().post(result.error.message);
  return result.ok;
};

export { deleteSavedSelection };
