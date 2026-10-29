/* @layer renderer-app @kind test */
import type { Session } from './e2e.type';

const WINDOW_SIZE = { width: 1280, height: 800 } as const;

const setWindow = (session: Session): Promise<void> =>
  session.app.evaluate(({ BrowserWindow }, size) => {
    BrowserWindow.getAllWindows()[0]?.setSize(size.width, size.height);
  }, WINDOW_SIZE);

export { setWindow, WINDOW_SIZE };
