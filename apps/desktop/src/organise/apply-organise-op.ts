/* @layer renderer-app @kind logic */
import type { ProjectOrganise } from '@bxel/project';
import type { OpHandler, OrganiseChange, OrganiseOp } from './organise.type';
import { ORGANISE_HANDLERS } from './organise-handlers.constants';

/** One change to the organise block, as data in and data out. Nothing is written here. */
const applyOrganiseOp = (organise: ProjectOrganise, op: OrganiseOp): OrganiseChange => {
  const handler: OpHandler = ORGANISE_HANDLERS[op.op] as OpHandler;
  return handler(organise, op);
};

export { applyOrganiseOp };
