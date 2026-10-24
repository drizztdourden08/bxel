/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const toggleLayer = async (session: Session, layerName: string, toggle: 'Visible' | 'Locked'): Promise<void> => {
  await session.page.getByRole('group', { name: layerName, exact: true }).getByRole('button', { name: toggle, exact: true }).click();
};

export { toggleLayer };
