/* @layer renderer-app @kind component */
import { Button, Field, Select, Stack } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { SWATCH_EDITOR_TEXT } from '../SwatchSetEditor.constants';
import type { SetBarProps } from '../SwatchSetEditor.type';

const CopyBar = ({ model }: SetBarProps) => {
  const [key, setKey] = useState('');
  return (
    <Field label={SWATCH_EDITOR_TEXT.copyTitle} hint={SWATCH_EDITOR_TEXT.copyHint}>
      <Stack gap="xs">
        <Select searchable groups={model.groups} value={key} placeholder={SWATCH_EDITOR_TEXT.copyPlaceholder} onChange={setKey} />
        <Button size="sm" variant="secondary" disabled={key === ''} onClick={() => model.copyFrom(key)}>
          {SWATCH_EDITOR_TEXT.copy}
        </Button>
      </Stack>
    </Field>
  );
};

export { CopyBar };
