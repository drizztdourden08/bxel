/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import { TOOL_TEXT } from './tools.constants';

const checkRevision = (view: DocumentView, expected: number | undefined): Failure | null => {
  const current = view.state.revision;
  if (expected === undefined || expected === current) return null;
  return mcpFailure(ERROR_CODE.STALE_REVISION, TOOL_TEXT.stale(current), { currentRevision: current });
};

export { checkRevision };
