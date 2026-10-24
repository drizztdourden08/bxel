/* @layer core @kind logic */
import type { ProgramMode, TrustStore } from './trust.type';

const setProgramMode = (store: TrustStore, key: string, mode: ProgramMode): TrustStore => ({
  ...store,
  programs: store.programs.map((program) => (program.key === key ? { ...program, mode } : program)),
});

export { setProgramMode };
