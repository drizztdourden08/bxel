/* @layer renderer-app @kind component */
import type { Rect } from '@bxel/document';
import { Field, Flex, NumberInput } from '@drizztdourden08/tessera';
import { SLICE_DIALOG_TEXT } from '../SliceDialog.constants';
import { RECT_KEYS } from './RectFields.constants';

const RectFields = ({ rect, label, onChange }: { rect: Rect; label: string; onChange: (rect: Rect) => void }) => (
  <Flex gap="sm" align="end" role="group" aria-label={label}>
    {RECT_KEYS.map((key) => (
      <Field key={key} label={SLICE_DIALOG_TEXT[key]}>
        <NumberInput size="sm" sizeToContent min={0} value={rect[key]} onChange={(next) => onChange({ ...rect, [key]: next })} />
      </Field>
    ))}
  </Flex>
);

export { RectFields };
