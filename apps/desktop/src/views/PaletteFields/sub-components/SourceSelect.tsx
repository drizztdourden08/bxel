/* @layer renderer-app @kind component */
import { Button, Field, Select, Stack } from '@drizztdourden08/tessera';
import { SOURCE_TEXT } from '../../../palette-source/palette-source.constants';
import { sourceGroups } from '../../../palette-source/source-groups';
import { sourceValue } from '../../../palette-source/source-value';
import { useSwatchLibrary } from '../../../swatch-library/useSwatchLibrary';
import { usePaletteFile } from '../behavior/usePaletteFile';
import type { SourceSelectProps } from '../PaletteFields.type';

const SourceSelect = ({ source, error, onChange }: SourceSelectProps) => {
  const library = useSwatchLibrary();
  const file = usePaletteFile(source, library, onChange);
  return (
    <Stack gap="xs">
      <Field label={SOURCE_TEXT.label} error={error ?? file.error ?? undefined}>
        <Select searchable groups={sourceGroups(source, library)} value={sourceValue(source)} onChange={file.choose} />
      </Field>
      {source.kind === 'file' && (
        <Button size="sm" variant="secondary" onClick={file.pick}>
          {SOURCE_TEXT.fileEntry}
        </Button>
      )}
    </Stack>
  );
};

export { SourceSelect };
