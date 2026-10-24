/* @layer renderer-app @kind logic */
import { layerRow } from './layer-row';
import type { Session } from './e2e.type';

const addLayer = async (session: Session, name: string): Promise<void> => {
  await session.page.getByRole('button', { name: /^New layer/ }).click();
  await layerRow(session, name).waitFor();
};

export { addLayer };
