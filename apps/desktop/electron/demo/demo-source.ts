/* @layer electron-main @kind logic */
import { app } from 'electron';
import { join } from 'path';
import { DEMO_RESOURCE_NAME, DEMO_SOURCE_FROM_BUILD } from './demo.constants';

const demoSource = (): string =>
  app.isPackaged ? join(process.resourcesPath, DEMO_RESOURCE_NAME) : join(import.meta.dirname, DEMO_SOURCE_FROM_BUILD);

export { demoSource };
