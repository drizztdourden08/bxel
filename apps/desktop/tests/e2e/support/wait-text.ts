/* @layer renderer-app @kind logic */
import { POLL_MS } from './e2e.constants';
import type { Session } from './e2e.type';

const waitText = (session: Session, pattern: RegExp, timeout = POLL_MS): Promise<void> =>
  session.page.getByText(pattern).first().waitFor({ timeout });

export { waitText };
