/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { DIALOG_TEXT } from '../../../../../sheet-manager/manager-text.constants';
import { resizeSprites } from '../../../../../sheet-manager/resize-sprites';
import { useResizeForm } from '../behavior/useResizeForm';
import type { ManagerModelProps } from '../../../SpritesPanel.type';
import { DialogFrame } from './DialogFrame';
import { ResizeFields } from './ResizeFields';

const ResizeDialog = ({ model }: ManagerModelProps) => {
  const form = useResizeForm(model);
  return (
    <DialogFrame title={DIALOG_TEXT.resizeTitle(form.targets.length)} canApply={form.targets.length > 0} onApply={() => resizeSprites(model.ids, form.spec)}>
      <Stack gap="md">
        <ResizeFields spec={form.spec} update={form.update} />
        {form.clips > 0 ? <Callout tone="warning">{DIALOG_TEXT.clips(form.clips)}</Callout> : <Text tone="dim">{DIALOG_TEXT.noClips}</Text>}
      </Stack>
    </DialogFrame>
  );
};

export { ResizeDialog };
