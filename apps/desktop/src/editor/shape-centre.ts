/* @layer renderer-app @kind logic */
import { useDrawingStore } from '../stores/useDrawingStore';

const shapeCentre = (altHeld: boolean): boolean => altHeld !== useDrawingStore.getState().shapeFromCentre;

export { shapeCentre };
