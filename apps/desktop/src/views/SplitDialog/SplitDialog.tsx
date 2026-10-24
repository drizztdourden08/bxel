/* @layer renderer-app @kind component */
import type { SplitFile } from '@bxel/document';
import { Button, Callout, DialogShell, Paragraph, RadioGroup, Stack, Text } from '@drizztdourden08/tessera';
import { SPLIT_TEXT } from '../../workspace/workspace.constants';
import { useSplitDialog } from './behavior/useSplitDialog';
import { DESTINATIONS } from './SplitDialog.constants';
import './SplitDialog.css';

const fileLine = (file: SplitFile): string => {
  const path = `${file.folder}/${file.fileName}`;
  if (file.suffix > 0) return SPLIT_TEXT.suffixed(path);
  return file.renamed ? SPLIT_TEXT.renamed(path) : path;
};

const SplitDialog = () => {
  const model = useSplitDialog();
  if (model.plan === null) return null;
  const actions = (
    <>
      <Button variant="tertiary" onClick={model.close}>{SPLIT_TEXT.cancel}</Button>
      <Button variant="primary" disabled={model.busy} onClick={model.run}>{SPLIT_TEXT.split}</Button>
    </>
  );
  return (
    <DialogShell open title={SPLIT_TEXT.title} onClose={model.close} actions={actions}>
      <Stack gap="sm">
        <Paragraph tone="dim">{SPLIT_TEXT.intro}</Paragraph>
        {model.hasProject && <RadioGroup label={SPLIT_TEXT.destination} value={model.destination} options={DESTINATIONS} onChange={model.setDestination} />}
        <Text as="span" variant="label">{SPLIT_TEXT.files}</Text>
        <Stack gap="xs" role="list" aria-label={SPLIT_TEXT.files} className="split-dialog__files">
          {model.plan.files.map((file) => <Text key={file.key.id} role="listitem">{fileLine(file)}</Text>)}
        </Stack>
        {(model.plan.conflicts.length > 0 || model.destination === 'project') && <Paragraph tone="dim">{SPLIT_TEXT.conflicts}</Paragraph>}
        {model.error !== null && <Callout tone="danger">{model.error}</Callout>}
      </Stack>
    </DialogShell>
  );
};

export { SplitDialog };
