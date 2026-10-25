/* @layer renderer-app @kind logic */
import { expect } from 'vitest';
import { auditPage } from './audit-page';
import { blockingFindings } from './blocking-findings';
import type { Session } from './e2e.type';

const SETTLE_MS = 20000;

const expectAccessible = async (session: Session, scene: string): Promise<void> => {
  await session.page.waitForFunction(() => document.getAnimations().every((each) => each.effect?.getComputedTiming().iterations === Infinity), undefined, {
    timeout: SETTLE_MS,
  });
  expect(blockingFindings(await auditPage(session.page)), scene).toEqual([]);
};

export { expectAccessible };
