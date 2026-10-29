/* @layer electron-main @kind constants */
const HANDOFF_KIND = 'assistant-restart';

const HANDOFF_MAX_AGE_MS = 60_000;

const HANDOFF_MAX_RESTART_MS = 300_000;

export { HANDOFF_KIND, HANDOFF_MAX_AGE_MS, HANDOFF_MAX_RESTART_MS };
