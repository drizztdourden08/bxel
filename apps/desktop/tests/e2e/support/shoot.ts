/* @layer renderer-app @kind logic */
import { join } from 'node:path';
import type { Session } from './e2e.type';

const shoot = async (session: Session, name: string): Promise<void> => {
  const folder = process.env['BXEL_SHOTS'];
  if (folder === undefined || folder === '') return;
  await session.page.screenshot({ path: join(folder, `${name}.png`) });
};

export { shoot };
