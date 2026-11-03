/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import type { NavigatorFacts, NavigatorLayout, ThumbBox } from '../Navigator.type';
import { fitThumb } from './fit-thumb';
import { keySteps } from './key-steps';

const useNavigatorLayout = (facts: NavigatorFacts | null, box: ThumbBox): NavigatorLayout => {
  const width = facts?.imageWidth ?? 0;
  const height = facts?.imageHeight ?? 0;
  const thumb = useMemo(() => (width > 0 && height > 0 && box.width > 0 ? fitThumb({ width, height }, box) : null), [width, height, box]);
  const steps = useMemo(() => keySteps({ width: facts?.width ?? 0, height: facts?.height ?? 0 }), [facts?.width, facts?.height]);
  return { width, height, thumb, steps };
};

export { useNavigatorLayout };
