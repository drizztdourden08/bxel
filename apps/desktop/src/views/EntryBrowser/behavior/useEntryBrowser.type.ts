/* @layer renderer-app @kind types */
import type { EntryFacts } from '../../../sheet-manager/manager.type';
import type { EntryDragSpec } from '../../../sheet-manager/drag-payload.type';
import type { BrowserState } from '../EntryBrowser.type';

interface EntryBrowserModel {
  state: BrowserState;
  patch: (change: Partial<BrowserState>) => void;
  shown: EntryFacts[];
  pick: (key: string, how: 'replace' | 'toggle' | 'range') => void;
  activate: (key: string) => void;
  dragFor: (key: string) => EntryDragSpec;
}

export type { EntryBrowserModel };
