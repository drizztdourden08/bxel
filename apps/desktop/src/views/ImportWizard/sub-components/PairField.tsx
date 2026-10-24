/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput, Span } from '@drizztdourden08/tessera';
import { IMPORT_TEXT } from '../../../image-import/image-import.constants';
import type { PairFieldProps } from '../ImportWizard.type';

const PairField = ({ label, x, y, min, max, error, onX, onY }: PairFieldProps) => (
  <Field label={label} error={error}>
    <Flex gap="sm" align="center">
      <NumberInput size="sm" sizeToContent min={min} max={max} step={1} value={x} aria-label={`${label} ${IMPORT_TEXT.x}`} onChange={onX} />
      <Span>x</Span>
      <NumberInput size="sm" sizeToContent min={min} max={max} step={1} value={y} aria-label={`${label} ${IMPORT_TEXT.y}`} onChange={onY} />
    </Flex>
  </Field>
);

export { PairField };
