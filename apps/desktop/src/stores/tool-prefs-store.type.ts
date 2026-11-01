/* @layer renderer-app @kind types */
interface ToolPrefs {
  openOnHover: boolean;
  holdMs: number;
  springMs: number;
  hiddenMembers: readonly string[];
}

interface ToolPrefsState extends ToolPrefs {
  patch: (change: Partial<ToolPrefs>) => void;
  toggleHidden: (memberId: string) => void;
  resetLayout: () => void;
}

export type { ToolPrefs, ToolPrefsState };
