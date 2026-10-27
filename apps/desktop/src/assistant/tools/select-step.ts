/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../../stores/useDocumentStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { SELECT_PARTS } from './select-parts.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const selectStep: ViewStep = (patch) => {
  const { select } = patch;
  if (!select) return null;
  const { host, activeId } = useDocumentStore.getState();
  const artwork = activeId === null ? null : (host.view(activeId)?.state.artwork ?? null);
  if (!artwork) return viewFail(APP_TOOL_TEXT.noSelectionTarget, 'select');
  for (const part of SELECT_PARTS) {
    const failed = part(select, artwork);
    if (failed) return failed;
  }
  return null;
};

export { selectStep };
