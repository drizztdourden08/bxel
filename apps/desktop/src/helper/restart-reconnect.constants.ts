/* @layer helper @kind constants */
const NEVER = new Promise<number | null>(() => undefined);

const RESTART_WAIT_MS = 90_000;

export { NEVER, RESTART_WAIT_MS };
