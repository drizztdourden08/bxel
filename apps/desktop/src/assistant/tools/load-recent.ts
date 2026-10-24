/* @layer renderer-app @kind logic */
import type { LoadReport } from '@bxel/document/native';
import { hiddenFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { decodeAt } from './decode-at';

const loadRecent = async (documents: DocumentsPort, path: string): Promise<McpResult<{ report: LoadReport; path: string }>> => {
  const full = await documents.openRecent(path);
  return full === null ? hiddenFailure('file') : decodeAt(documents, full);
};

export { loadRecent };
