/* @layer renderer-app @kind logic */
const isRecord = (raw: unknown): raw is Record<string, unknown> => typeof raw === 'object' && raw !== null && !Array.isArray(raw);

export { isRecord };
