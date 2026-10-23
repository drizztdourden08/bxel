/* @layer renderer-app @kind logic */
const subscribeTo = <L>(listeners: Set<L>, listener: L): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export { subscribeTo };
