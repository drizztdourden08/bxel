/* @layer renderer-app @kind logic */
import { MANAGER_DEFAULTS } from '../stores/manager-store.constants';
import type { ManagerSettings } from '../stores/manager-store.type';
import { useManagerStore } from '../stores/useManagerStore';
import { SAVE_DELAY_MS } from './manager-views.constants';
import type { SaveViews, ViewBookState } from './manager-views.type';
import { putView } from './put-view';
import { readViews } from './read-views';
import { sameView } from './same-view';
import { viewOf } from './view-of';

const state: ViewBookState = { views: {}, loaded: false, active: null, quiet: false, save: null, timer: null, stop: null };

const emit = (): void => {
  if (state.timer !== null) clearTimeout(state.timer);
  state.timer = null;
  state.save?.(state.views);
};

const remember = (settings: ManagerSettings): void => {
  const id = state.active;
  if (id === null || state.quiet) return;
  const view = viewOf(settings);
  const before = state.views[id];
  if (before && sameView(before, view)) return;
  state.views = putView(state.views, id, view);
  if (state.timer !== null) clearTimeout(state.timer);
  state.timer = setTimeout(emit, SAVE_DELAY_MS);
};

const detach = (): void => {
  state.stop?.();
  state.stop = null;
  state.active = null;
};

const attach = (sheetId: string, raw: unknown): void => {
  detach();
  if (!state.loaded) {
    state.views = readViews(raw);
    state.loaded = true;
  }
  state.active = sheetId;
  state.quiet = true;
  useManagerStore.setState({ ...(state.views[sheetId] ?? viewOf(MANAGER_DEFAULTS)), dialog: null });
  state.quiet = false;
  state.stop = useManagerStore.subscribe(remember);
};

const connect = (save: SaveViews | null): void => {
  state.save = save;
};

const flush = (): void => {
  if (state.timer !== null) emit();
};

const reset = (): void => {
  detach();
  if (state.timer !== null) clearTimeout(state.timer);
  Object.assign(state, { views: {}, loaded: false, quiet: false, save: null, timer: null });
};

const viewBook = { attach, connect, detach, flush, reset };

export { viewBook };
