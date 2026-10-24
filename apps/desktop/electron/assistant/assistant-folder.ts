/* @layer electron-main @kind logic */
import { app } from 'electron';
import { join } from 'path';
import { FOLDER_NAME } from './assistant.constants';
import type { AssistantMain } from './assistant.type';

const assistantFolder = (state: AssistantMain): string => (state.folder === '' ? join(app.getPath('documents'), FOLDER_NAME) : state.folder);

export { assistantFolder };
