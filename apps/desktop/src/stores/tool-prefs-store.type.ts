/* @layer renderer-app @kind types */
import type { SurfaceLayout } from '../editor/tool-catalogue/slot-layout.type';
import type { DrawSurface } from '../editor/tool-catalogue/tool-catalogue.type';

type SurfaceLayouts = Readonly<Partial<Record<DrawSurface, SurfaceLayout>>>;

interface ToolPrefs {
  openOnHover: boolean;
  holdMs: number;
  springMs: number;
  hiddenMembers: readonly string[];
  optionTiers: Readonly<Record<string, 1 | 2>>;
  layouts: SurfaceLayouts;
}

interface ToolPrefsState extends ToolPrefs {
  patch: (change: Partial<ToolPrefs>) => void;
  toggleHidden: (memberId: string) => void;
  resetLayout: () => void;
  placeSlots: (surface: DrawSurface, layout: SurfaceLayout) => void;
  resetSurface: (surface: DrawSurface, memberIds: readonly string[]) => void;
  setOptionTier: (optionId: string, tier: 1 | 2 | null) => void;
}

export type { SurfaceLayouts, ToolPrefs, ToolPrefsState };
