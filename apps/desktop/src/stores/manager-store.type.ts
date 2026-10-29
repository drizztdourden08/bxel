/* @layer renderer-app @kind types */
import type { SheetId } from '@bxel/document';
import type { SavedSelection } from '../sheet-manager/folders.type';
import type { AtlasSettings, ManagerDialog, ManagerFilter, ManagerView, SortKey } from '../sheet-manager/manager.type';

interface ManagerSettings {
  view: ManagerView;
  zoom: number;
  query: string;
  filter: ManagerFilter;
  sortKey: SortKey;
  sortDown: boolean;
  dialog: ManagerDialog;
  picked: readonly string[];
  sheetId: SheetId | null;
  layoutOpen: boolean;
  folderTarget: string | null;
  showExport: boolean;
  libraryRequest: number;
  atlas: AtlasSettings;
  collapsed: readonly string[];
  selections: readonly SavedSelection[];
}

interface ManagerState extends ManagerSettings {
  reset: () => void;
  patch: (change: Partial<ManagerSettings>) => void;
  patchFilter: (change: Partial<ManagerFilter>) => void;
  patchAtlas: (change: Partial<AtlasSettings>) => void;
  clearFilters: () => void;
  toggleFolder: (path: string) => void;
  saveSelection: (selection: SavedSelection) => void;
  dropSelection: (name: string) => void;
}

export type { ManagerSettings, ManagerState };
