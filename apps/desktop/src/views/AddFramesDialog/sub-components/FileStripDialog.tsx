/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { useMemo, useState } from 'react';
import { DURATION_START, STRIP_START } from '../../../add-frames/add-frames.constants';
import type { StripResult, StripSpec } from '../../../add-frames/add-frames.type';
import { DROP_TEXT } from '../../../add-frames/image-drop.constants';
import { runAddFrames } from '../../../add-frames/run-add-frames';
import { stripPlan } from '../../../add-frames/strip-plan';
import { FrameModeFields } from '../../FrameModeFields';
import { StripFields } from '../../StripFields';
import type { FileDialogProps } from '../AddFramesDialog.type';
import { AddFramesShell } from './AddFramesShell';

const FileStripDialog = ({ focus, file }: FileDialogProps) => {
  const { width, height } = focus.animation;
  const [spec, setSpec] = useState<StripSpec>({ ...STRIP_START, by: 'size', cellWidth: width, cellHeight: height });
  const [result, setResult] = useState<StripResult>('cells');
  const [durationMs, setDurationMs] = useState(DURATION_START);
  const plan = useMemo(() => stripPlan(file, spec), [file, spec]);
  const ready = plan.error === null && plan.cells.length > 0;
  return (
    <AddFramesShell
      title={DROP_TEXT.stripTitle}
      canAdd={ready}
      onAdd={() => {
        runAddFrames({ kind: 'file', file, spec, cells: plan.cells.length, result, durationMs, at: file.at });
      }}
    >
      <Stack gap="md">
        <Text>{DROP_TEXT.stripSource(file.name, file.width, file.height)}</Text>
        <StripFields spec={spec} plan={plan} result={result} onSpec={(change) => setSpec((current) => ({ ...current, ...change }))} onResult={setResult} />
        <FrameModeFields mode={null} durationMs={durationMs} onMode={() => undefined} onDuration={setDurationMs} />
      </Stack>
    </AddFramesShell>
  );
};

export { FileStripDialog };
