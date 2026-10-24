/* @layer renderer-app @kind types */
import type { SheetId } from '@bxel/document';
import type { AtlasSettings, ManagerDialog, ManagerFilter, ManagerTab, ManagerView, SortKey } from '../sheet-manager/manager.type';

interface ManagerSettings {
  tab: ManagerTab;
  view: ManagerView;
  zoom: number;
  query: string;
  filter: ManagerFilter;
  sortKey: SortKey;
  sortDown: boolean;
  sheetId: SheetId | null;
  dialog: ManagerDialog;
  atlas: AtlasSettings;
}

interface ManagerState extends ManagerSettings {
  reset: () => void;
  patch: (change: Partial<ManagerSettings>) => void;
  patchFilter: (change: Partial<ManagerFilter>) => void;
  patchAtlas: (change: Partial<AtlasSettings>) => void;
  clearFilters: () => void;
}

export type { ManagerSettings, ManagerState };
