/* @layer renderer-app @kind constants */
import { MCP_ERROR_CODE } from '@bxel/mcp';

const KNOWN_CODES: ReadonlySet<string> = new Set(Object.values(MCP_ERROR_CODE));

export { KNOWN_CODES };
