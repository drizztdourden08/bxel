/* @layer core @kind logic */
import type { Failure } from '../errors/error.type';
import { MCP_ERROR_CODE } from '../errors/mcp-error-code.constants';
import { mcpFailure } from '../errors/mcp-failure';
import type { SessionAccess } from '../scope/scope.type';
import { toolNeedsEdit } from './tool-needs-edit';
import type { ToolName } from './tool.type';

const checkToolMode = (name: ToolName, input: unknown, session: SessionAccess): Failure | null =>
  session === 'read' && toolNeedsEdit(name, input)
    ? mcpFailure(
        MCP_ERROR_CODE.READ_ONLY_SESSION,
        `${name} needs edit mode. This session is read only; ask the owner to allow editing.`,
      )
    : null;

export { checkToolMode };
