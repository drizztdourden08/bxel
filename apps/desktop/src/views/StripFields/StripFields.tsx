/* @layer renderer-app @kind component */
import { MAX_SPRITE_SIZE } from '@bxel/document';
import { Callout, Field, Flex, NumberInput, RadioGroup, Stack, Text } from '@drizztdourden08/tessera';
import { ADD_TEXT, BY_OPTIONS, RESULT_OPTIONS } from '../../add-frames/add-frames.constants';
import type { StripFieldsProps } from './StripFields.type';

const StripFields = ({ spec, plan, result, onSpec, onResult }: StripFieldsProps) => {
  const pair =
    spec.by === 'count'
      ? [
          { label: ADD_TEXT.columns, value: spec.columns, change: (columns: number) => onSpec({ columns }) },
          { label: ADD_TEXT.rows, value: spec.rows, change: (rows: number) => onSpec({ rows }) },
        ]
      : [
          { label: ADD_TEXT.cellWidth, value: spec.cellWidth, change: (cellWidth: number) => onSpec({ cellWidth }) },
          { label: ADD_TEXT.cellHeight, value: spec.cellHeight, change: (cellHeight: number) => onSpec({ cellHeight }) },
        ];
  const [first] = plan.cells;
  return (
    <Stack gap="md">
      <RadioGroup label={ADD_TEXT.by} direction="horizontal" value={spec.by} options={[...BY_OPTIONS]} onChange={(by) => onSpec({ by })} />
      <Flex gap="sm" align="center">
        {pair.map((each) => (
          <Field key={each.label} label={each.label}>
            <NumberInput size="sm" sizeToContent min={1} max={MAX_SPRITE_SIZE} step={1} value={each.value} onChange={each.change} />
          </Field>
        ))}
      </Flex>
      <RadioGroup label={ADD_TEXT.result} value={result} options={RESULT_OPTIONS.map((option) => ({ ...option }))} onChange={onResult} />
      {plan.error === null ? (
        <Text tone="dim" aria-live="polite">{first ? ADD_TEXT.willAdd(plan.cells.length, first.width, first.height) : ''}</Text>
      ) : (
        <Callout tone="danger">{plan.error}</Callout>
      )}
    </Stack>
  );
};

export { StripFields };
