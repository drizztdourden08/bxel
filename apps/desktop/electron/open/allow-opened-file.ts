/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { OpenRequest } from '@drizztdourden08/brock-core';

const allowOpenedFile = (request: OpenRequest, ctx: MainContext): void => {
  if (request.kind === 'file') ctx.documents.allow(request.path);
};

export { allowOpenedFile };
