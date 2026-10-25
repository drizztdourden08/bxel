/* @layer renderer-app @kind component */
import { Button, Field, Flex, TextInput } from '@drizztdourden08/tessera';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { SetBarProps } from '../SwatchSetEditor.type';

const ColorDetail = ({ model }: SetBarProps) => {
  const color = model.current?.colors[model.index];
  if (color === undefined) return null;
  return (
    <Flex gap="sm" align="end" wrap>
      <Field label={SWATCH_EDITOR_TEXT.colorName(model.index, color.rgb)}>
        <TextInput value={color.name} onChange={(event) => model.nameColor(event.target.value)} />
      </Field>
      <Button size="sm" variant="secondary" disabled={(model.current?.colors.length ?? 0) <= 1} onClick={model.removeColor}>
        {SWATCH_EDITOR_TEXT.removeColor}
      </Button>
    </Flex>
  );
};

export { ColorDetail };
