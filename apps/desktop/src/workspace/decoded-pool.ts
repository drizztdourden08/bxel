/* @layer renderer-app @kind logic */
import type { DecodedPool } from './workspace.type';

const decodedPool = (): DecodedPool => ({ all: [], byPath: new Map(), byId: new Map() });

export { decodedPool };
