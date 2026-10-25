/* @layer electron-main @kind logic */
import { access, cp } from 'fs/promises';
import { join } from 'path';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { DemoCopyOutcome } from '../../src/demo/demo.type';
import { DEMO_FOLDER_NAME, DEMO_PROJECT_FILE } from './demo.constants';
import { demoSource } from './demo-source';

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

const copyDemo = async (ctx: MainContext, parent: string): Promise<DemoCopyOutcome> => {
  try {
    const granted = await ctx.documents.resolve(parent, 'write');
    const target = join(granted, DEMO_FOLDER_NAME);
    if (await exists(join(target, DEMO_PROJECT_FILE))) return { ok: true, path: target, reused: true };
    await cp(demoSource(), target, { recursive: true, force: false, errorOnExist: true });
    return { ok: true, path: target, reused: false };
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : String(error) };
  }
};

export { copyDemo };
