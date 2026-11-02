/* @layer renderer-app @kind logic */
import { stepRequest } from '../transactions/step-request';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { COMMAND_OF, LABEL_OF } from './brush-library-run.constants';
import type { LibraryAction } from './brush-library-run.type';

const forgetRemoved = ({ kind, id }: LibraryAction): void => {
  const drawing = useDrawingStore.getState();
  if (kind === 'brush' && drawing.brushId === id) drawing.patch({ brushId: null });
  if (kind === 'pattern' && drawing.patternId === id) drawing.patch({ patternId: null });
};

const runLibraryAction = (action: LibraryAction): boolean => {
  const { host, activeId } = useDocumentStore.getState();
  if (activeId === null) return false;
  const options = action.action === 'rename' ? { [action.kind]: action.id, name: action.name } : { [action.kind]: action.id };
  const step = { name: COMMAND_OF[action.kind][action.action], targets: null, options };
  const result = host.execute(stepRequest(host, activeId, LABEL_OF[action.kind][action.action], [step]));
  if (!result.ok) useNoticeStore.getState().post(result.error.message);
  if (result.ok && action.action === 'remove') forgetRemoved(action);
  return result.ok;
};

export { runLibraryAction };
