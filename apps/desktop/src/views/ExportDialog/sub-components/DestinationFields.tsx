/* @layer renderer-app @kind component */
import { Button, Field, Flex, Stack, TextInput } from '@drizztdourden08/tessera';
import { EXPORT_DIALOG_TEXT } from '../ExportDialog.constants';
import type { DestinationFieldsProps } from '../ExportDialog.type';

const DestinationFields = ({ settings, change, placeholder, onBrowse, onEnter }: DestinationFieldsProps) => (
  <Stack gap="md">
    <Field label={EXPORT_DIALOG_TEXT.folder}>
      <Flex gap="sm">
        <TextInput
          size="sm"
          grow
          value={settings.folder}
          aria-label={EXPORT_DIALOG_TEXT.folderName}
          onChange={(event) => change({ folder: event.target.value })}
        />
        <Button size="sm" variant="secondary" onClick={onBrowse}>
          {EXPORT_DIALOG_TEXT.browse}
        </Button>
      </Flex>
    </Field>
    <Field label={EXPORT_DIALOG_TEXT.fileName}>
      <TextInput
        size="sm"
        value={settings.fileName}
        placeholder={placeholder}
        aria-label={EXPORT_DIALOG_TEXT.fileName}
        onChange={(event) => change({ fileName: event.target.value })}
        onEnter={onEnter}
      />
    </Field>
  </Stack>
);

export { DestinationFields };
