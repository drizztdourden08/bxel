/* @layer renderer-app @kind component */
import type { SheetId } from '@bxel/document';
import { Field, Select, Stack, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { ADD_TEXT, DURATION_START } from '../../../add-frames/add-frames.constants';
import type { FrameMode } from '../../../add-frames/add-frames.type';
import { eligibleSheets } from '../../../add-frames/eligible-sheets';
import { eligibleSprites } from '../../../add-frames/eligible-sprites';
import { runAddFrames } from '../../../add-frames/run-add-frames';
import { sheetSprites } from '../../../add-frames/sheet-sprites';
import { insertAt } from '../../../timeline/insert-at';
import { FrameModeFields } from '../../FrameModeFields';
import type { FocusDialogProps } from '../AddFramesDialog.type';
import { AddFramesShell } from './AddFramesShell';

const SheetDialog = ({ focus }: FocusDialogProps) => {
  const sheets = eligibleSheets(focus.artwork, focus.animation);
  const [sheetId, setSheetId] = useState<SheetId | null>(sheets[0]?.id ?? null);
  const [mode, setMode] = useState<FrameMode>('reference');
  const [durationMs, setDurationMs] = useState(DURATION_START);
  const sheet = sheets.find((each) => each.id === sheetId) ?? null;
  const count = sheet ? sheetSprites(sheet, eligibleSprites(focus.artwork, focus.animation).sprites).length : 0;
  return (
    <AddFramesShell
      title={ADD_TEXT.sheetTitle}
      canAdd={count > 0}
      onAdd={() => {
        if (sheet) runAddFrames({ kind: 'sheet', sheet: sheet.id, mode, durationMs, at: insertAt(focus) });
      }}
    >
      <Stack gap="md">
        {sheets.length === 0 ? (
          <Text tone="muted">{ADD_TEXT.noSheets}</Text>
        ) : (
          <Field label={ADD_TEXT.pickSheet}>
            <Select options={sheets.map((each) => ({ value: each.id, label: each.name }))} value={sheetId ?? ''} onChange={(value) => setSheetId(value as SheetId)} aria-label={ADD_TEXT.pickSheet} />
          </Field>
        )}
        <FrameModeFields mode={mode} durationMs={durationMs} onMode={setMode} onDuration={setDurationMs} />
        <Text tone="dim" aria-live="polite">{ADD_TEXT.willAddSprites(count)}</Text>
      </Stack>
    </AddFramesShell>
  );
};

export { SheetDialog };
