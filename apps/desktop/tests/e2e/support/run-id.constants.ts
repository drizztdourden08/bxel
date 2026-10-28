/* @layer renderer-app @kind constants */
import { randomBytes } from 'node:crypto';

const RUN_ENV = 'BXEL_E2E_RUN';

const E2E_RUN_ID = process.env[RUN_ENV] ?? `solo${randomBytes(3).toString('hex')}`;

export { E2E_RUN_ID, RUN_ENV };
