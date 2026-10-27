/* @layer core @kind logic */
import type { Grant } from '../grants/grant.type';
import { modeOfGrant } from '../grants/mode-of-grant';
import type { TrustStore } from './trust.type';

const setProgramGrant = (store: TrustStore, key: string, grant: Grant): TrustStore => ({
  ...store,
  programs: store.programs.map((program) => (program.key === key ? { ...program, grant, mode: modeOfGrant(grant) } : program)),
});

export { setProgramGrant };
