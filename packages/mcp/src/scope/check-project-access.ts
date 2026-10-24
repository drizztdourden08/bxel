/* @layer core @kind logic */
import type { Failure } from '../errors/error.type';
import { MCP_ERROR_CODE } from '../errors/mcp-error-code.constants';
import { mcpFailure } from '../errors/mcp-failure';
import type { ProjectAccess, SessionAccess } from './scope.type';

const checkProjectAccess = (access: ProjectAccess, needs: SessionAccess): Failure | null => {
  if (access === 'edit' || (access === 'read' && needs === 'read')) return null;
  const message =
    access === 'off'
      ? 'This project has no assistant access. Ask the owner to grant it in Project settings.'
      : 'This project is granted read only. Ask the owner to grant editing in Project settings.';
  return mcpFailure(MCP_ERROR_CODE.PROJECT_NOT_GRANTED, message);
};

export { checkProjectAccess };
