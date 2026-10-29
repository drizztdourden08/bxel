/* @layer renderer-app @kind types */
import type { Rect } from '@bxel/document';

interface SliceForm {
  name: string;
  rect: Rect;
  pivotOn: boolean;
  pivot: { x2: number; y2: number };
  centreOn: boolean;
  centre: Rect;
}

interface SliceFormModel {
  form: SliceForm;
  valid: boolean;
  update: (change: Partial<SliceForm>) => void;
  apply: () => void;
}

interface SliceFieldsProps {
  model: SliceFormModel;
}

export type { SliceFieldsProps, SliceForm, SliceFormModel };
