/* @layer renderer-app @kind logic */
import { expect } from 'vitest';
import type { Session } from './e2e.type';

const expectAnnounced = (session: Session, text: string | RegExp): Promise<void> =>
  expect.poll(() => session.page.getByRole('status').filter({ hasText: text }).count()).toBe(1);

export { expectAnnounced };
