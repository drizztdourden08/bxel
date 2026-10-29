/* @layer core @kind logic */
const framePositions = (frames: readonly { readonly id: string }[]): ReadonlyMap<string, number> =>
  new Map(frames.map((frame, index) => [frame.id, index] as const));

export { framePositions };
