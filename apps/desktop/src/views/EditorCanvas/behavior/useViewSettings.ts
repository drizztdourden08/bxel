/* @layer renderer-app @kind hook */
import { useRulerUnits } from './useRulerUnits';
import { useViewDefaults } from './useViewDefaults';

const useViewSettings = (): void => {
  useViewDefaults();
  useRulerUnits();
};

export { useViewSettings };
