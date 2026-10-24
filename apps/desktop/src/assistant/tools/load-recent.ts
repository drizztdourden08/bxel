/* @layer renderer-app @kind logic */
import type { LoadReport } from '@bxel/document/native';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { issueText } from '../../files/issue-text';
import { readArtworkFile } from '../../files/read-artwork-file';
import { TOOL_TEXT } from './tools.constants';

const loadRecent = async (documents: DocumentsPort, path: string): Promise<McpResult<{ report: LoadReport; path: string }>> => {
  const full = await documents.openRecent(path);
  if (full === null) return hiddenFailure('file');
  const read = await readArtworkFile(documents, full);
  if ('message' in read) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, read.message);
  if (read.report.outcome === 'fatal' || read.report.artwork === null) {
    return mcpFailure(read.report.issues[0]?.code ?? MCP_ERROR_CODE.FILE_NOT_SUPPORTED, issueText(read.report) || TOOL_TEXT.notBxel);
  }
  return { ok: true, value: { report: read.report, path: full } };
};

export { loadRecent };
