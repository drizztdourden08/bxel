/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { transformBox } from '../../../editor/transform/transform-box';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { usePendingStore } from '../../../stores/usePendingStore';
import type { TransformBarModel } from '../TransformBar.type';

const useTransformBar = (): TransformBarModel | null => {
  const target = useEditorTarget();
  const pending = usePendingStore((state) => state.pending);
  return useMemo(() => {
    if (!target || pending?.spec.kind !== 'transform') return null;
    const box = transformBox(pending);
    return box ? { spec: pending.spec, box } : null;
  }, [target, pending]);
};

export { useTransformBar };
