/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { editOrganiseWith } from './edit-organise-with';
import { ORGANISE_TEXT } from './organise.constants';
import type { OrganiseOp, OrganiseOutcome } from './organise.type';

const editOrganise = (op: OrganiseOp): Promise<OrganiseOutcome> => {
  const kit = fileKit();
  return kit ? editOrganiseWith(kit, op) : Promise.resolve({ ok: false, message: ORGANISE_TEXT.noProject });
};

export { editOrganise };
