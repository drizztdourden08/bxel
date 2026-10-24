/* @layer renderer-app @kind logic */
const edgeRuns = (length: number, isEdge: (at: number) => boolean, emit: (from: number, to: number) => void): void => {
  let start = -1;
  for (let at = 0; at <= length; at += 1) {
    const edge = at < length && isEdge(at);
    if (edge && start < 0) start = at;
    if (!edge && start >= 0) {
      emit(start, at);
      start = -1;
    }
  }
};

export { edgeRuns };
