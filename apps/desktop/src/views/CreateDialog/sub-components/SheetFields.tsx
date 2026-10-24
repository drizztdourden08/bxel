/* @layer renderer-app @kind component */
import { Field, Flex, NumberInput, Span } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import { SIZE_RANGE } from '../../../sprite-name/sprite-name.constants';
import type { CreateFieldsProps } from '../CreateDialog.type';

const SheetFields = ({ form, errors, update }: CreateFieldsProps) => (
  <Flex direction="column" gap="sm">
    <Field label={NEW_TEXT.cell} error={errors.size ?? undefined}>
      <Flex gap="sm" align="center" wrap>
        <NumberInput
          size="sm"
          sizeToContent
          min={SIZE_RANGE.min}
          max={SIZE_RANGE.max}
          step={1}
          value={form.cellWidth}
          aria-label={NEW_TEXT.width}
          onChange={(cellWidth) => update({ cellWidth })}
        />
        <Span>x</Span>
        <NumberInput
          size="sm"
          sizeToContent
          min={SIZE_RANGE.min}
          max={SIZE_RANGE.max}
          step={1}
          value={form.cellHeight}
          aria-label={NEW_TEXT.height}
          onChange={(cellHeight) => update({ cellHeight })}
        />
      </Flex>
    </Field>
    <Field label={NEW_TEXT.grid} error={errors.sheet ?? undefined}>
      <Flex gap="sm" align="center" wrap>
        <NumberInput size="sm" sizeToContent min={1} step={1} value={form.columns} aria-label={NEW_TEXT.columns} onChange={(columns) => update({ columns })} />
        <Span>{NEW_TEXT.columns}</Span>
        <Span>x</Span>
        <NumberInput size="sm" sizeToContent min={1} step={1} value={form.rows} aria-label={NEW_TEXT.rows} onChange={(rows) => update({ rows })} />
        <Span>{NEW_TEXT.rows}</Span>
      </Flex>
    </Field>
  </Flex>
);

export { SheetFields };
