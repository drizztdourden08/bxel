/* @layer core @kind logic */
import { programKey } from './program-key';
import { PROGRAM_KEY_MAX } from './trust.constants';
import { trimPrograms } from './trim-programs';
import type { HelloClient, ProgramMode, TrustStore } from './trust.type';

const rememberProgram = (store: TrustStore, client: HelloClient, mode: ProgramMode, now: string): TrustStore => {
  const key = programKey(client.name);
  if (key === null) return store;
  const earlier = store.programs.find((program) => program.key === key);
  const entry = {
    key,
    displayName: (client.name ?? key).trim().slice(0, PROGRAM_KEY_MAX),
    mode,
    firstApproved: earlier?.firstApproved ?? now,
    lastConnected: now,
    lastVersion: client.version,
  };
  const others = store.programs.filter((program) => program.key !== key);
  return { ...store, programs: trimPrograms([entry, ...others]) };
};

export { rememberProgram };
