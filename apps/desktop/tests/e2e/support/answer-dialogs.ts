/* @layer renderer-app @kind logic */
import type { DialogAnswers, Session } from './e2e.type';

const answerDialogs = (session: Session, answers: DialogAnswers): Promise<void> =>
  session.app.evaluate(({ dialog }, picked) => {
    dialog.showOpenDialog = () =>
      Promise.resolve(picked.open === null ? { canceled: true, filePaths: [] } : { canceled: false, filePaths: [picked.open] });
    dialog.showSaveDialog = () =>
      Promise.resolve(picked.save === null ? { canceled: true, filePath: '' } : { canceled: false, filePath: picked.save });
  }, answers);

export { answerDialogs };
