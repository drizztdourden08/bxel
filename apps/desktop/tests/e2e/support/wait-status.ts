/* @layer renderer-app @kind logic */
import { expect } from 'vitest';
import { POLL_MS, STATUS_LABEL } from './e2e.constants';
import type { Session } from './e2e.type';

const waitStatus = (session: Session, pattern: RegExp): Promise<void> =>
  expect.poll(() => session.page.getByRole('region', { name: STATUS_LABEL }).innerText(), { timeout: POLL_MS }).toMatch(pattern);

export { waitStatus };
