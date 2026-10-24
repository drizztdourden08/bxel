/* @layer renderer-app @kind component */
import { Button, Callout, DialogShell, Stack, Text } from '@drizztdourden08/tessera';
import { resizeActiveSprite } from '../../../canvas-size/resize-active-sprite';
import { DIALOG_TEXT } from '../../../sheet-manager/manager-text.constants';
import { useCanvasSizeStore } from '../../../stores/useCanvasSizeStore';
import { useCanvasSizeForm } from '../behavior/useCanvasSizeForm';
import { SizeFields } from './SizeFields';

const CanvasSizeContent = () => {
  const hide = useCanvasSizeStore((state) => state.hide);
  const { spec, clips, valid, update } = useCanvasSizeForm();
  const apply = (): void => {
    resizeActiveSprite(spec);
    hide();
  };
  const actions = (
    <>
      <Button variant="tertiary" onClick={hide}>
        {DIALOG_TEXT.cancel}
      </Button>
      <Button variant="primary" disabled={!valid} onClick={apply}>
        {DIALOG_TEXT.apply}
      </Button>
    </>
  );
  return (
    <DialogShell open title={DIALOG_TEXT.resizeTitle(1)} onClose={hide} actions={actions}>
      <Stack gap="md">
        <SizeFields spec={spec} update={update} />
        {clips > 0 ? <Callout tone="warning">{DIALOG_TEXT.clips(clips)}</Callout> : <Text tone="dim">{DIALOG_TEXT.noClips}</Text>}
      </Stack>
    </DialogShell>
  );
};

export { CanvasSizeContent };
