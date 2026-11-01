/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { editOrganise } from './edit-organise';
import type { OrganiseOp } from './organise.type';

const runOrganise = (op: OrganiseOp): void => {
  void editOrganise(op).then((outcome) => {
    if (!outcome.ok) toast(outcome.message, { variant: 'warning' });
  });
};

export { runOrganise };
