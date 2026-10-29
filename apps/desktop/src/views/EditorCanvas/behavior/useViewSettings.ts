/* @layer renderer-app @kind hook */
import { useRulerUnits } from './useRulerUnits';
import { useSymmetrySync } from './useSymmetrySync';
import { useViewDefaults } from './useViewDefaults';

const useViewSettings = (): void => {
  useViewDefaults();
  useRulerUnits();
  useSymmetrySync();
};

export { useViewSettings };
