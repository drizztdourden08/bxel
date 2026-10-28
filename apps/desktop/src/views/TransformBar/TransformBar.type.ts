/* @layer renderer-app @kind types */
import type { Rect } from '@bxel/raster';
import type { TransformField, TransformSpec } from '../../editor/transform/transform.type';

interface TransformBarModel {
  spec: TransformSpec;
  box: Rect;
}

interface NumberFieldProps {
  field: TransformField;
  model: TransformBarModel;
}

interface PivotFieldProps {
  model: TransformBarModel;
}

interface MethodFieldProps {
  model: TransformBarModel;
}

export type { MethodFieldProps, NumberFieldProps, PivotFieldProps, TransformBarModel };
