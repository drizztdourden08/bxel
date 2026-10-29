/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const resizeWindow = async (session: Session, width: number, height: number): Promise<void> => {
  await session.app.evaluate(({ BrowserWindow }, [wide, high]) => BrowserWindow.getAllWindows()[0]?.setSize(wide ?? 0, high ?? 0), [width, height]);
};

export { resizeWindow };
