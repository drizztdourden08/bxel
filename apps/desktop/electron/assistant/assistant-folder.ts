/* @layer electron-main @kind logic */
import { app } from 'electron';
import { join } from 'path';
import { FOLDER_NAME } from './assistant.constants';

const assistantFolder = (): string => join(app.getPath('documents'), FOLDER_NAME);

export { assistantFolder };
