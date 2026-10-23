/* @layer renderer-app @kind logic */
import { randomIdSource } from '@bxel/document';
import type { IdSource } from '@bxel/document';

const browserIdSource = (): IdSource => randomIdSource((length) => crypto.getRandomValues(new Uint8Array(length)));

export { browserIdSource };
