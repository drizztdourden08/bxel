/* @layer renderer-app @kind logic */
import { shownImage } from './shown-image';

const takeRepaint = (): boolean => {
  const pending = shownImage.repaint;
  shownImage.repaint = false;
  return pending;
};

export { takeRepaint };
