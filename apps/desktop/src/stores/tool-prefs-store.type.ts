/* @layer renderer-app @kind types */
interface ToolPrefs {
  openOnHover: boolean;
  holdMs: number;
  springMs: number;
  hiddenMembers: readonly string[];
  optionTiers: Readonly<Record<string, 1 | 2>>;
}

interface ToolPrefsState extends ToolPrefs {
  patch: (change: Partial<ToolPrefs>) => void;
  toggleHidden: (memberId: string) => void;
  resetLayout: () => void;
  setOptionTier: (optionId: string, tier: 1 | 2 | null) => void;
}

export type { ToolPrefs, ToolPrefsState };
