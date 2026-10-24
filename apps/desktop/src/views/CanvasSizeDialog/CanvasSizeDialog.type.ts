/* @layer renderer-app @kind types */
import type { ResizeSpec } from '../../sheet-manager/manager.type';

interface CanvasSizeForm {
  spec: ResizeSpec;
  clips: number;
  valid: boolean;
  update: (change: Partial<ResizeSpec>) => void;
}

interface SizeFieldsProps {
  spec: ResizeSpec;
  update: CanvasSizeForm['update'];
}

export type { CanvasSizeForm, SizeFieldsProps };
