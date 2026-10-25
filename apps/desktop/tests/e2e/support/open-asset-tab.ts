/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import type { Session } from './e2e.type';

const openAssetTab = (session: Session, name: RegExp): Locator =>
  session.page.getByRole('tablist', { name: 'Open assets' }).getByRole('tab', { name });

export { openAssetTab };
