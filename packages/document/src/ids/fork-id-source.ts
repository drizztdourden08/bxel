/* @layer core @kind logic */
import type { IdSource } from './id-source.type';

const forkIdSource = (source: IdSource): IdSource => source.fork();

export { forkIdSource };
