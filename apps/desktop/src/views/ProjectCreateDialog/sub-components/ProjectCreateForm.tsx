/* @layer renderer-app @kind component */
import { Button, Callout, DialogShell, Field, Stack, Text, TextInput } from '@drizztdourden08/tessera';
import { PROJECT_TEXT } from '../../../project/project.constants';
import { useProjectCreate } from '../behavior/useProjectCreate';

const ProjectCreateForm = () => {
  const model = useProjectCreate();
  return (
    <DialogShell
      open
      title={PROJECT_TEXT.newTitle}
      onClose={model.hide}
      actions={
        <>
          <Button variant="tertiary" onClick={model.hide}>
            {PROJECT_TEXT.cancel}
          </Button>
          <Button variant="primary" disabled={!model.valid} onClick={model.create}>
            {PROJECT_TEXT.create}
          </Button>
        </>
      }
    >
      <Stack gap="md">
        <Field label={PROJECT_TEXT.nameLabel}>
          <TextInput value={model.name} onChange={(event) => model.setName(event.target.value)} />
        </Field>
        <Field label={PROJECT_TEXT.folderLabel}>
          <Stack gap="xs">
            <Text variant="caption" tone="muted">
              {model.folder ?? PROJECT_TEXT.folderNone}
            </Text>
            <Button variant="secondary" size="sm" onClick={model.choose}>
              {PROJECT_TEXT.choose}
            </Button>
          </Stack>
        </Field>
        <Text variant="caption" tone="muted">
          {PROJECT_TEXT.folderHint}
        </Text>
        {model.error !== null && <Callout tone="danger">{model.error}</Callout>}
      </Stack>
    </DialogShell>
  );
};

export { ProjectCreateForm };
