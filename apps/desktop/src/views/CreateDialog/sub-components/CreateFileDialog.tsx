/* @layer renderer-app @kind component */
import { Callout, DialogShell, Stack, Text } from '@drizztdourden08/tessera';
import { NEW_TEXT } from '../../../new-sprite/new-sprite.constants';
import { useCreateDialogStore } from '../../../stores/useCreateDialogStore';
import { PaletteFields } from '../../PaletteFields';
import { useNewFile } from '../behavior/useNewFile';
import { BackgroundField } from './BackgroundField';
import { CreateActions } from './CreateActions';
import { KindField } from './KindField';
import { NameField } from './NameField';
import { ResultLines } from './ResultLines';
import { SheetFields } from './SheetFields';
import { SizeFields } from './SizeFields';

const CreateFileDialog = () => {
  const { form, errors, summary, failure, valid, update, create } = useNewFile();
  const hide = useCreateDialogStore((state) => state.hide);
  const fields = { form, errors, update };
  const label = form.kind === 'sheet' ? NEW_TEXT.createSheet : NEW_TEXT.create;
  return (
    <DialogShell
      open
      title={NEW_TEXT.title}
      onClose={hide}
      actions={<CreateActions label={label} valid={valid} onCreate={create} />}
      className="create-dialog"
    >
      <Stack gap="md">
        <KindField {...fields} />
        <NameField {...fields} />
        {form.kind === 'sprite' ? <SizeFields {...fields} /> : <SheetFields {...fields} />}
        <BackgroundField {...fields} />
        <Text variant="label">{NEW_TEXT.palette}</Text>
        <PaletteFields
          value={{ source: form.source, limit: form.limit, transparent: form.transparent }}
          limitError={errors.limit}
          paletteError={errors.palette}
          withSource
          onChange={update}
        />
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
