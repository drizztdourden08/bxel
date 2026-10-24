/* @layer core @kind logic */
import { programKey } from './program-key';
import type { HelloClient, TrustStore } from './trust.type';

const touchProgram = (store: TrustStore, client: HelloClient, now: string): TrustStore => {
  const key = programKey(client.name);
  if (key === null) return store;
  return {
    ...store,
    programs: store.programs.map((program) =>
      program.key === key ? { ...program, lastConnected: now, lastVersion: client.version } : program,
    ),
  };
};

export { touchProgram };
