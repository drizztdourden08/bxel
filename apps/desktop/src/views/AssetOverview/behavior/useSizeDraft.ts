/* @layer renderer-app @kind hook */
import { useCallback, useState } from 'react';
import { resizeFocused } from '../../../asset-overview/resize-focused';
import type { SizeDraft, SizeFormProps } from '../AssetOverview.type';

const useSizeDraft = ({ model, fields }: SizeFormProps): SizeDraft => {
  const [width, setWidth] = useState(fields.width);
  const [height, setHeight] = useState(fields.height);
  const valid = Number.isInteger(width) && Number.isInteger(height) && width > 0 && height > 0;
  const apply = useCallback(() => {
    if (valid) resizeFocused(model.focus, width, height);
  }, [valid, model.focus, width, height]);
  return { width, height, valid, setWidth, setHeight, apply };
};

export { useSizeDraft };
