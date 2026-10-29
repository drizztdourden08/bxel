/* @layer renderer-app @kind hook */
import { useEffect } from 'react';
import { useDocumentStore } from '../../../stores/useDocumentStore';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useSpriteStore } from '../../../stores/useSpriteStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { useToolStore } from '../../../stores/useToolStore';
import { reconcileSymmetry } from '../../../symmetry/reconcile-symmetry';

const useSymmetrySync = (): void => {
  useEffect(() => {
    reconcileSymmetry();
    const stops = [useToolStore, useDrawingStore, useDocumentStore, useSpriteStore, useTilemapStore].map((store) => store.subscribe(reconcileSymmetry));
    return () => stops.forEach((stop) => stop());
  }, []);
};

export { useSymmetrySync };
