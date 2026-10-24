/* @layer renderer-app @kind types */
type CreationMode = 'closed' | 'file' | 'sprite';

interface CreationState {
  mode: CreationMode;
  show: (mode: 'file' | 'sprite') => void;
  hide: () => void;
}

export type { CreationState };
