/* @layer renderer-app @kind component */
import { Button, DialogShell, Field, NumberInput, SegmentedControl, Stack, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { applyGuide } from '../../../guides/apply-guide';
import { guideLimit } from '../../../guides/guide-limit';
import { removeGuide } from '../../../guides/remove-guide';
import { useGuideDialogStore } from '../../../stores/useGuideDialogStore';
import { CancelApply } from '../../CancelApply';
import { GUIDE_DIALOG_TEXT } from '../GuideDialog.constants';

const GuideDialogContent = () => {
  const { axis, from, position: first, hide } = useGuideDialogStore();
  const [which, setWhich] = useState(axis);
  const [position, setPosition] = useState(first);
  const limit = guideLimit(which);
  const valid = Number.isFinite(position) && position >= 0 && position <= limit;
  const apply = (): void => {
    applyGuide({ axis: which, from, to: position });
    hide();
  };
  const remove = (): void => {
    if (from !== null) removeGuide({ axis, position: from });
    hide();
  };
  const actions = (
    <>
      {from !== null && (
        <Button variant="tertiary" onClick={remove}>
          {GUIDE_DIALOG_TEXT.remove}
        </Button>
      )}
      <CancelApply valid={valid} onCancel={hide} onApply={apply} />
    </>
  );
  return (
    <DialogShell open title={from === null ? GUIDE_DIALOG_TEXT.titleNew : GUIDE_DIALOG_TEXT.titleEdit} onClose={hide} actions={actions}>
      <Stack gap="md">
        {from === null && (
          <SegmentedControl
            size="sm"
            label={GUIDE_DIALOG_TEXT.axis}
            value={which}
            options={[
              { value: 'x', label: GUIDE_DIALOG_TEXT.vertical },
              { value: 'y', label: GUIDE_DIALOG_TEXT.horizontal },
            ]}
            onChange={setWhich}
          />
        )}
        <Field label={GUIDE_DIALOG_TEXT.position}>
          <NumberInput size="sm" sizeToContent min={0} max={limit} step={0.5} value={position} onChange={setPosition} />
        </Field>
        <Text tone="dim">{GUIDE_DIALOG_TEXT.hint}</Text>
      </Stack>
    </DialogShell>
  );
};

export { GuideDialogContent };
