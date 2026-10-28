/* @layer renderer-app @kind logic */
import { hasActiveDocument } from '../../files/has-active-document';
import { APP_TOOL_TEXT } from './app-tool.constants';

const offReason = (): string => (hasActiveDocument() ? APP_TOOL_TEXT.offHere : APP_TOOL_TEXT.offNoDocument);

export { offReason };
