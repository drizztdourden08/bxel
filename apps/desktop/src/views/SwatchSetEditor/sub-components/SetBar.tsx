/* @layer renderer-app @kind component */
import { ArmedIconButton, Button, Field, Flex, Select } from '@drizztdourden08/tessera';
import type { SwatchSetId } from '@bxel/project';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { SetBarProps } from '../SwatchSetEditor.type';

const SetBar = ({ model }: SetBarProps) => {
  const options = model.sets.map((set) => ({ value: set.setId, label: set.name }));
  return (
    <Field label={SWATCH_EDITOR_TEXT.setLabel}>
      <Flex gap="sm" align="center" wrap>
        <Select
          options={options}
          value={model.current?.setId ?? ''}
          placeholder={SWATCH_EDITOR_TEXT.setPlaceholder}
          onChange={(value) => model.select(value as SwatchSetId)}
        />
        <Button size="sm" variant="secondary" onClick={model.create}>
          {SWATCH_EDITOR_TEXT.newSet}
        </Button>
        <Button size="sm" variant="secondary" onClick={model.importFile}>
          {SWATCH_EDITOR_TEXT.importFile}
        </Button>
        <ArmedIconButton
          icon="trash-2"
          tone="danger"
          label={SWATCH_EDITOR_TEXT.deleteSet}
          armedLabel={SWATCH_EDITOR_TEXT.deleteArmed}
          disabled={model.current === null}
          onConfirm={model.deleteSet}
        />
      </Flex>
    </Field>
  );
};

export { SetBar };
