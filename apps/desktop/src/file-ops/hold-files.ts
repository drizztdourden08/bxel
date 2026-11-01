/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { useFileClipboardStore } from '../stores/useFileClipboardStore';
import { FILE_OPS_TEXT } from './file-ops.constants';

const holdFiles = (paths: readonly string[], cut: boolean): void => {
  const real = paths.filter((path) => path !== '');
  if (real.length === 0) return;
  useFileClipboardStore.getState().hold({ paths: real, cut });
  announce(FILE_OPS_TEXT.held(real.length, cut));
};

export { holdFiles };
