/* @layer renderer-app @kind logic */
import type { TransformField } from '../../../editor/transform/transform.type';

const fieldId = (field: TransformField): string => `transform-field-${field}`;

export { fieldId };
