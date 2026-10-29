/* @layer renderer-app @kind logic */
import { framesOf } from './animation-ui';
import { buildBlankAnimation } from './build-blank-animation';
import type { Session } from './e2e.type';
import { openFile } from './open-file';
import { openSession } from './open-session';

const openCompassRig = async (): Promise<{ readonly session: Session }> => {
  const session = await openSession();
  await openFile(session, await buildBlankAnimation(session.dir, 'compass'));
  await framesOf(session).waitFor();
  return { session };
};

export { openCompassRig };
