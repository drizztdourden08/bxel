/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { stepRequest } from '../transactions/step-request';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import type { LibraryAction } from './brush-library-run.type';

const COMMAND_OF: Readonly<Record<LibraryAction['kind'], Readonly<Record<LibraryAction['action'], string>>>> = {
  brush: { rename: COMMAND_NAME.brushUpdate, remove: COMMAND_NAME.brushDelete },
  pattern: { rename: COMMAND_NAME.patternUpdate, remove: COMMAND_NAME.patternDelete },
};

const LABEL_OF: Readonly<Record<LibraryAction['kind'], Readonly<Record<LibraryAction['action'], string>>>> = {
  brush: { rename: 'Rename brush', remove: 'Delete brush' },
  pattern: { rename: 'Rename pattern', remove: 'Delete pattern' },
};

const forgetRemoved = ({ kind, id }: LibraryAction): void => {
  const drawing = useDrawingStore.getState();
  if (kind === 'brush' && drawing.brushId === id) drawing.patch({ brushId: null });
  if (kind === 'pattern' && drawing.patternId === id) drawing.patch({ patternId: null });
};

const runLibraryAction =(action: LibraryAction): boolean => {
  const { host, activeId } = useDocumentStore.getState();
  if (activeId === null) return false;
  const ref = { by: 'id', id: action.id };
  const options = action.action === 'rename' ? { [action.kind]: ref, name: action.name } : { [action.kind]: ref };
  const step = { name: COMMAND_OF[action.kind][action.action], targets: null, options };
  const result = host.execute(stepRequest(host, activeId, LABEL_OF[action.kind][action.action], [step]));
  if (!result.ok) useNoticeStore.getState().post(result.error.message);
  if (result.ok && action.action === 'remove') forgetRemoved(action);
  return result.ok;
};

export { runLibraryAction };
