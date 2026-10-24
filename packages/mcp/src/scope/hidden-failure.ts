/* @layer core @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { Failure } from '../errors/error.type';
import { MCP_ERROR_CODE } from '../errors/mcp-error-code.constants';
import { mcpFailure } from '../errors/mcp-failure';
import type { MissingSubject } from './scope.type';

const hiddenFailure = (subject: MissingSubject): Failure => {
  if (subject === 'document') {
    return mcpFailure(ERROR_CODE.DOCUMENT_NOT_FOUND, 'No such document is open. Call list_documents.');
  }
  if (subject === 'file') return mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, 'No such file. Call list_places or list_files.');
  return mcpFailure(MCP_ERROR_CODE.PROJECT_NOT_FOUND, 'No such project. Call list_places.');
};

export { hiddenFailure };
