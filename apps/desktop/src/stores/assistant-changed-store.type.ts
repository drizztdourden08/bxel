/* @layer renderer-app @kind types */
interface AssistantChangedState {
  changed: Readonly<Record<string, true>>;
  mark: (ids: readonly string[]) => void;
  clear: (id: string) => void;
}

export type { AssistantChangedState };
