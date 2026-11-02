/* @layer renderer-app @kind types */
interface CycleNoteState {
  text: string | null;
  set: (text: string | null) => void;
}

export type { CycleNoteState };
