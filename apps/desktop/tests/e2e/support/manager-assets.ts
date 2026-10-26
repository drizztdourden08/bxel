/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import type { Session } from './e2e.type';

const managerAssets = (session: Session): Locator => session.page.getByRole('list', { name: 'Assets of the project' });

export { managerAssets };
