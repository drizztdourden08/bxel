/* @layer core @kind logic */
const oneOfFrames = (value: { readonly frame?: unknown; readonly frames?: unknown }): boolean => (value.frame === undefined) !== (value.frames === undefined);

export { oneOfFrames };
