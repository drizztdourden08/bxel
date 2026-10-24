/* @layer core @kind logic */
const mcpOk = <T extends object>(value: T): { readonly ok: true } & T => ({ ok: true as const, ...value });

export { mcpOk };
