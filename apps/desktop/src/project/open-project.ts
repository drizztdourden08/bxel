/* @layer renderer-app @kind logic */
import { openProjectAt } from './open-project-at';
import { pickAndActivate } from './pick-and-activate';
import { reportProjectOutcome } from './report-project-outcome';
import { runProjectTask } from './run-project-task';

const openProject = async (startAt?: string, direct = false): Promise<void> => {
  const outcome = await runProjectTask((documents) =>
    direct && startAt !== undefined ? openProjectAt(documents, startAt) : pickAndActivate(documents, startAt),
  );
  reportProjectOutcome(outcome);
};

export { openProject };
