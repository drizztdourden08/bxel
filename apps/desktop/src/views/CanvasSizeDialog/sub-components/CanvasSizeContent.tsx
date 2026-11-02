/* @layer renderer-app @kind component */
import { Callout, DialogShell, Stack, Text } from '@drizztdourden08/tessera';
import { resizeActiveSprite } from '../../../canvas-size/resize-active-sprite';
import { DIALOG_TEXT } from '../../../sheet-manager/manager-text.constants';
import { useCanvasSizeStore } from '../../../stores/useCanvasSizeStore';
import { CancelApply } from '../../CancelApply';
import { useCanvasSizeForm } from '../behavior/useCanvasSizeForm';
import { SizeFields } from './SizeFields';

const CanvasSizeContent = () => {
  const hide = useCanvasSizeStore((state) => state.hide);
  const { spec, clips, valid, update, tile, tileMultiple, setTileMultiple } = useCanvasSizeForm();
  const apply = (): void => {
    resizeActiveSprite(spec);
    hide();
  };
  return (
    <DialogShell open title={DIALOG_TEXT.resizeTitle(1)} onClose={hide} actions={<CancelApply valid={valid} onCancel={hide} onApply={apply} />}>
      <Stack gap="md">
        <SizeFields spec={spec} update={update} tile={tile} tileMultiple={tileMultiple} setTileMultiple={setTileMultiple} />
        {clips > 0 ? <Callout tone="warning">{DIALOG_TEXT.clips(clips)}</Callout> : <Text tone="dim">{DIALOG_TEXT.noClips}</Text>}
      </Stack>
    </DialogShell>
  );
};

export { CanvasSizeContent };
