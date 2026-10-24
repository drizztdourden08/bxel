/* @layer renderer-app @kind logic */
import type { DialogAnswers, Session } from './e2e.type';

const answerDialogs = (session: Session, answers: DialogAnswers): Promise<void> =>
  session.app.evaluate(({ dialog }, picked) => {
    const saves = picked.save === null ? [] : [picked.save].flat();
    dialog.showOpenDialog = () =>
      Promise.resolve(picked.open === null ? { canceled: true, filePaths: [] } : { canceled: false, filePaths: [picked.open] });
    dialog.showSaveDialog = () => {
      const next = saves.length > 1 ? saves.shift() : saves[0];
      return Promise.resolve(next === undefined ? { canceled: true, filePath: '' } : { canceled: false, filePath: next });
    };
  }, answers);

export { answerDialogs };
