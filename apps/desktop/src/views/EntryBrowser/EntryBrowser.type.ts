/* @layer renderer-app @kind types */
import type { DragEvent, ReactNode } from 'react';
import type { Artwork } from '@bxel/document';
import type { DragEntry, DragSource } from '../../sheet-manager/drag-payload.type';
import type { EntryFacts, EntryKind } from '../../sheet-manager/manager.type';
import type { PickHow } from '../../sheet/sheet.type';

type BrowserView = 'grid' | 'list';

interface EntryBrowserProps {
  label: string;
  artwork: Artwork;
  entries: readonly EntryFacts[];
  picked: readonly string[];
  onPickedChange: (picked: readonly string[]) => void;
  onActivate?: (key: string) => void;
  kinds?: readonly EntryKind[];
  emptyMessage: ReactNode;
  noMatchMessage?: ReactNode;
  dragSource?: DragSource;
  dragEntries?: (keys: readonly string[]) => readonly DragEntry[];
  searchLabel?: string;
  footer?: ReactNode;
  className?: string;
}

interface BrowserState {
  query: string;
  kind: EntryKind;
  view: BrowserView;
  zoom: number;
}

interface BrowserBarProps {
  state: BrowserState;
  kinds: readonly EntryKind[];
  searchLabel: string;
  patch: (change: Partial<BrowserState>) => void;
}

interface BrowserDrag {
  onDragStart: (event: DragEvent<HTMLElement>) => void;
  onDragEnd: () => void;
}

interface BrowserBodyProps {
  label: string;
  artwork: Artwork;
  shown: readonly EntryFacts[];
  picked: readonly string[];
  zoom: number;
  pick: (key: string, how: PickHow) => void;
  activate: (key: string) => void;
  draggable: boolean;
  dragFor: (key: string) => BrowserDrag;
}

export type { BrowserBarProps, BrowserDrag, BrowserBodyProps, BrowserState, BrowserView, EntryBrowserProps };
