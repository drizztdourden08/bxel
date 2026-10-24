/* @layer core @kind logic */
import type { TrustStore } from './trust.type';

const forgetAllPrograms = (store: TrustStore): TrustStore => ({ ...store, programs: [] });

export { forgetAllPrograms };
