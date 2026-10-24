/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const showPanelView = async (session: Session, view: 'Folders' | 'Assets'): Promise<void> => {
  const radio = session.page.getByRole('radiogroup', { name: 'Project view' }).getByRole('radio', { name: view, exact: true });
  await radio.waitFor();
  if ((await radio.getAttribute('aria-checked')) !== 'true') await radio.click();
};

export { showPanelView };
