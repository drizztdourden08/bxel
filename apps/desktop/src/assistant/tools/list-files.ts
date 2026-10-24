/* @layer renderer-app @kind logic */
import { hiddenFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { reply } from './reply';

const listFiles: ToolHandler = () => reply(hiddenFailure('project'));

export { listFiles };
