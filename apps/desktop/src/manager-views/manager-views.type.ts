/* @layer renderer-app @kind types */
import type { ManagerSettings } from '../stores/manager-store.type';

type SavedManagerView = Pick<
  ManagerSettings,
  'tab' | 'view' | 'zoom' | 'query' | 'filter' | 'sortKey' | 'sortDown' | 'atlas' | 'collapsed' | 'selections'
>;

type ManagerViews = Readonly<Record<string, SavedManagerView>>;

type SaveViews = (views: ManagerViews) => void;

type ViewBookState = {
  views: ManagerViews;
  loaded: boolean;
  active: string | null;
  quiet: boolean;
  save: SaveViews | null;
  timer: ReturnType<typeof setTimeout> | null;
  stop: (() => void) | null;
};

export type { ManagerViews, SavedManagerView, SaveViews, ViewBookState };
