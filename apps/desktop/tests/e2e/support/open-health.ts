/* @layer renderer-app @kind test */
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';
import { runMenu } from './run-menu';

const openHealth = async (session: Session): Promise<void> => {
  await runMenu(session, [/^Project/, /^Project health/]);
  await session.page.getByRole('heading', { name: 'Health', exact: true }).waitFor({ timeout: POLL_MS });
};

export { openHealth };
