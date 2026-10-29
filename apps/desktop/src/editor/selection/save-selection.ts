/* @layer renderer-app @kind logic */
import { SELECTION_COMMAND } from '@bxel/raster';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { commitRequest } from '../commit-request';
import { currentTarget } from '../current-target';
import { spriteScope } from '../sprite-scope';
import { SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';
import { selectionMask } from './selection-mask';

const saveSelection = (name: string): boolean => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  const notices = useNoticeStore.getState();
  if (!target || !mask) {
    notices.post(SELECTION_TEXT.nothingSelected);
    return false;
  }
  const step = { name: SELECTION_COMMAND.selectionSave, options: { name: name.trim(), mask } };
  const result = useDocumentStore.getState().host.execute(commitRequest(target, SELECTION_LABELS.save(name.trim()), step, spriteScope(target)));
  if (!result.ok) notices.post(result.error.message);
  return result.ok;
};

export { saveSelection };
