/* @layer renderer-app @kind types */
import type { ReactNode } from 'react';
import type { Sprite } from '@bxel/document';
import type { PivotMode, RenamePlan, RenameSpec, ResizeAnchor, ResizeSpec } from '../../../../sheet-manager/manager.type';

interface RenameForm {
  spec: RenameSpec;
  plan: RenamePlan;
  targets: readonly Sprite[];
  update: (change: Partial<RenameSpec>) => void;
}

interface RenameFieldsProps {
  spec: RenameSpec;
  update: (change: Partial<RenameSpec>) => void;
}

interface RenamePreviewProps {
  plan: RenamePlan;
}

interface ResizeForm {
  spec: ResizeSpec;
  targets: readonly Sprite[];
  clips: number;
  update: (change: Partial<ResizeSpec>) => void;
}

interface ResizeFieldsProps {
  spec: ResizeSpec;
  update: (change: Partial<ResizeSpec>) => void;
}

interface AnchorPickerProps {
  value: ResizeAnchor;
  onChange: (anchor: ResizeAnchor) => void;
}

interface PivotFormState {
  kind: 'preset' | 'exact' | 'first';
  preset: string;
  x: number;
  y: number;
}

interface PivotForm {
  form: PivotFormState;
  targets: readonly Sprite[];
  mode: PivotMode;
  now: string;
  update: (change: Partial<PivotFormState>) => void;
}

interface PivotFieldsProps {
  form: PivotFormState;
  update: (change: Partial<PivotFormState>) => void;
}

interface PairValue {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

interface NumberPairProps {
  first: PairValue;
  second: PairValue;
  min: number;
  max: number;
  step: number;
}

interface DialogFrameProps {
  title: string;
  canApply: boolean;
  onApply: () => void;
  children: ReactNode;
}

export type {
  AnchorPickerProps,
  DialogFrameProps,
  NumberPairProps,
  PivotFieldsProps,
  PivotForm,
  PivotFormState,
  RenameFieldsProps,
  RenameForm,
  RenamePreviewProps,
  ResizeFieldsProps,
  ResizeForm,
};
