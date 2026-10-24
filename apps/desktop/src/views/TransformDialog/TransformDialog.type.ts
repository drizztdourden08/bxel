/* @layer renderer-app @kind types */
import type { BoundsPolicy } from '@bxel/raster';
import type { DialogSpec, PendingSpec } from '../../editor/pending/pending.type';

type RotateSpec = Extract<PendingSpec, { kind: 'rotate' }>;

type ScaleSpec = Extract<PendingSpec, { kind: 'scale' }>;

interface TransformDialogModel {
  spec: DialogSpec;
  failed: boolean;
  note: string | null;
}

interface BoundsFieldProps {
  bounds: BoundsPolicy;
  onChange: (bounds: BoundsPolicy) => void;
}

interface RotateFieldsProps {
  spec: RotateSpec;
  onChange: (spec: RotateSpec) => void;
}

interface ScaleFieldsProps {
  spec: ScaleSpec;
  onChange: (spec: ScaleSpec) => void;
}

interface DialogFieldsProps {
  spec: DialogSpec;
}

export type { BoundsFieldProps, DialogFieldsProps, RotateFieldsProps, ScaleFieldsProps, TransformDialogModel };
