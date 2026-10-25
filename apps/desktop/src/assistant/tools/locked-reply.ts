/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { lockedDocument } from './locked-document';
import { lockedFailure } from './locked-failure';
import { reply } from './reply';

const lockedReply = (context: ToolContext, documentId: string): ToolReply | null =>
  lockedDocument(context, documentId) ? reply(lockedFailure()) : null;

export { lockedReply };
