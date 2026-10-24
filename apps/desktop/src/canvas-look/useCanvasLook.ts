/* @layer renderer-app @kind hook */
import { useSettings } from '@drizztdourden08/brock-react';
import { useMemo } from 'react';
import type { AppSettings } from '../settings.type';
import type { CanvasLook } from './canvas-look.type';
import { lookOf } from './look-of';

const useCanvasLook = (): CanvasLook => {
  const { settings } = useSettings<AppSettings>();
  return useMemo(() => lookOf(settings), [settings]);
};

export { useCanvasLook };
