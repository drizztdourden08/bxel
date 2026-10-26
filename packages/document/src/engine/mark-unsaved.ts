/* @layer core @kind logic */
import type { EngineStore } from './engine.type';
import { moveSavedPoint } from './move-saved-point';

const markUnsaved = (store: EngineStore): void => {
  moveSavedPoint(store, null, 'Unsaved');
};

export { markUnsaved };
