/* @layer renderer-app @kind logic */
import { dialogs } from '@drizztdourden08/brock-react';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const dialogStep: ViewStep = (patch) => {
  const { dialog } = patch;
  if (!dialog) return null;
  const answered = dialogs.answer(dialog.answer);
  return answered.ok ? null : viewFail(answered.reason, 'dialog.answer');
};

export { dialogStep };
