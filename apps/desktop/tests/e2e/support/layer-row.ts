/* @layer renderer-app @kind logic */
import type { Locator } from 'playwright-core';
import type { Session } from './e2e.type';

const layerRow = (session: Session, name: string): Locator =>
  session.page.getByRole('region', { name: 'Layers' }).getByRole('list', { name: 'Layers' }).getByRole('button', { name, exact: true });

export { layerRow };
