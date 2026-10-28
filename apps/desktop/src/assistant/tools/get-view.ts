/* @layer renderer-app @kind logic */
import type { ToolHandler } from '../assistant.type';
import { reply } from './reply';
import { viewFor } from './view-for';
import { viewSnapshot } from './view-snapshot';

const getView: ToolHandler = (_input, context) => {
  const window = context.call.instance.window;
  const sees = (documentId: string): boolean => viewFor(context, documentId) !== null;
  return reply({ ok: true, window, visible: window === 'visible', ...viewSnapshot(sees) });
};

export { getView };
