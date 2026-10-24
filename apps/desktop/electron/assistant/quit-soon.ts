/* @layer electron-main @kind logic */
import { app } from 'electron';
import { QUIT_DELAY_MS } from './assistant.constants';

const quitSoon = (): void => {
  setTimeout(() => app.quit(), QUIT_DELAY_MS);
};

export { quitSoon };
