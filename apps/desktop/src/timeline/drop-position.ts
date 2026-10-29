/* @layer renderer-app @kind logic */
const dropPosition = (from: number | null, index: number, mark: 'before' | 'after'): number => {
  const slot = mark === 'before' ? index : index + 1;
  if (from === null) return slot + 1;
  return (from < slot ? slot - 1 : slot) + 1;
};

export { dropPosition };
