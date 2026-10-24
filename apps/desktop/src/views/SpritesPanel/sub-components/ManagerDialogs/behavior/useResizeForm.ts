/* @layer renderer-app @kind hook */
import { useMemo, useState } from 'react';
import type { ResizeSpec } from '../../../../../sheet-manager/manager.type';
import { resizeClips } from '../../../../../sheet-manager/resize-clips';
import type { ResizeForm } from '../ManagerDialogs.type';
import type { ManagerModel } from '../../../SpritesPanel.type';
import { useTargets } from './useTargets';

const useResizeForm = (model: ManagerModel): ResizeForm => {
  const targets = useTargets(model);
  const first = targets[0];
  const [spec, setSpec] = useState<ResizeSpec>({ width: first?.width ?? 1, height: first?.height ?? 1, anchor: 'center' });
  const clips = useMemo(() => resizeClips(targets, spec), [targets, spec]);
  return { spec, targets, clips, update: (change) => setSpec((current) => ({ ...current, ...change })) };
};

export { useResizeForm };
