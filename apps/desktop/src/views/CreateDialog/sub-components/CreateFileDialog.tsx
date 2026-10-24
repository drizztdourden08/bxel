/* @layer renderer-app @kind component */
import { Callout, DialogShell, Stack, Text } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import { CREATE_LABEL } from '../CreateDialog.constants';
import { useNewFile } from '../behavior/useNewFile';
import { CreateActions } from './CreateActions';
import { KindField } from './KindField';
import { KindFields } from './KindFields';
import { NameField } from './NameField';
import { ResultLines } from './ResultLines';

const CreateFileDialog = () => {
  const { form, errors, summary, failure, valid, update, create, inDocument } = useNewFile();
  const hide = useCreateDialogStore((state) => state.hide);
  const fields = { form, errors, update, inDocument };
  return (
    <DialogShell
      open
      title={NEW_TEXT.title}
      onClose={hide}
      actions={<CreateActions label={CREATE_LABEL[form.kind]} valid={valid} onCreate={create} />}
      className="create-dialog"
    >
      <Stack gap="md">
        <KindField {...fields} />
        <NameField {...fields} />
        <KindFields {...fields} />
        <ResultLines summary={summary} />
        {failure !== null && <Callout tone="danger">{failure}</Callout>}
        <Text variant="caption" tone="muted">
          {NEW_TEXT.nothing}
        </Text>
      </Stack>
    </DialogShell>
  );
};

export { CreateFileDialog };
