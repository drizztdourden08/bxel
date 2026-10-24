/* @layer electron-main @kind logic */
import { dirname } from 'node:path';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { OpenRequest } from '@drizztdourden08/brock-core';
import { FOLDER_OPENED_EXTENSIONS } from './open.constants';

const allowOpenedFile = (request: OpenRequest, ctx: MainContext): void => {
  if (request.kind !== 'file') return;
  ctx.documents.allow(request.path);
  if (FOLDER_OPENED_EXTENSIONS.includes(request.ext.toLowerCase())) ctx.documents.allowFolder(dirname(request.path));
};

export { allowOpenedFile };
