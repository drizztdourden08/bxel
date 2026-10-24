/* @layer renderer-app @kind logic */
import type { Session } from './e2e.type';

const answerOpenInOrder = (session: Session, paths: readonly string[]): Promise<void> =>
  session.app.evaluate(({ dialog }, picked) => {
    let next = 0;
    dialog.showOpenDialog = () => {
      const path = picked[Math.min(next, picked.length - 1)];
      next += 1;
      return Promise.resolve(path === undefined ? { canceled: true, filePaths: [] } : { canceled: false, filePaths: [path] });
    };
  }, paths);

export { answerOpenInOrder };
