/* @layer renderer-app @kind logic */
const opaqueSlots = (limit: number, transparent: boolean): number => Math.max(0, limit - (transparent ? 1 : 0));

export { opaqueSlots };
