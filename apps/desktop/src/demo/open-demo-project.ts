/* @layer renderer-app @kind logic */
import { channelApi } from '@drizztdourden08/brock-react';
import { APP_CHANNELS } from '../ipc/contract.constants';
import { openProjectAt } from '../project/open-project-at';
import { reportProjectOutcome } from '../project/report-project-outcome';
import { runProjectTask } from '../project/run-project-task';
import { DEMO_TEXT } from './demo.constants';

const openDemoProject = async (): Promise<void> => {
  const outcome = await runProjectTask(async (documents) => {
    const parent = await documents.openFolder({ title: DEMO_TEXT.pickTitle });
    if (parent === null) return null;
    const copy = await channelApi(APP_CHANNELS).demoCopy(parent);
    return copy.ok ? openProjectAt(documents, copy.path) : { ok: false, message: copy.message };
  });
  reportProjectOutcome(outcome);
};

export { openDemoProject };
