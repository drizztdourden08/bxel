/* @layer core @kind logic */
import type { ProgramMode } from '../trust/trust.type';
import { canWriteDocuments } from './can-write-documents';
import type { Grant } from './grant.type';

const modeOfGrant = (grant: Grant): ProgramMode => {
  if (grant.blocked) return 'blocked';
  return canWriteDocuments(grant) ? 'edit' : 'read';
};

export { modeOfGrant };
