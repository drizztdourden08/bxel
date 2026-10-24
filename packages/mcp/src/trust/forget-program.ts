/* @layer core @kind logic */
import type { TrustStore } from './trust.type';

const forgetProgram = (store: TrustStore, key: string): TrustStore => ({
  ...store,
  programs: store.programs.filter((program) => program.key !== key),
});

export { forgetProgram };
