/* @layer renderer-app @kind logic */
import { openTarget } from './open-target';
import { projectTarget } from './project-target';
import { recentTarget } from './recent-target';
import { reply } from './reply';
import type { OpenInput } from './tool-input.type';
import type { ToolHandler } from '../assistant.type';

const openFile: ToolHandler = async (input, context) => {
  const { file, activate } = input as OpenInput;
  const target = 'recentId' in file ? await recentTarget(context, file.recentId) : await projectTarget(context, file);
  return target.ok ? openTarget(context, target.value, activate) : reply(target);
};

export { openFile };
