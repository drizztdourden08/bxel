/* @layer core @kind logic */
import type { EngineStore } from './engine.type';
import { moveSavedPoint } from './move-saved-point';

const markSaved = (store: EngineStore): void => {
  moveSavedPoint(store, store.history.cursor, 'Save');
};

export { markSaved };
