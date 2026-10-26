/* @layer renderer-app @kind component */
import type { SpriteId } from '@bxel/document';
import { Field, Select, Stack, Text } from '@drizztdourden08/tessera';
import { useMemo, useState } from 'react';
import { ADD_TEXT, DURATION_START, STRIP_START } from '../../../add-frames/add-frames.constants';
import type { StripResult, StripSpec } from '../../../add-frames/add-frames.type';
import { defaultStripSprite } from '../../../add-frames/default-strip-sprite';
import { eligibleSprites } from '../../../add-frames/eligible-sprites';
import { runAddFrames } from '../../../add-frames/run-add-frames';
import { stripPlan } from '../../../add-frames/strip-plan';
import { insertAt } from '../../../timeline/insert-at';
import { FrameModeFields } from '../../FrameModeFields';
import { StripFields } from '../../StripFields';
import type { FocusDialogProps } from '../AddFramesDialog.type';
import { AddFramesShell } from './AddFramesShell';

const StripDialog = ({ focus }: FocusDialogProps) => {
  const { sprites, other } = eligibleSprites(focus.artwork, focus.animation);
  const [spriteId, setSpriteId] = useState<SpriteId | null>(defaultStripSprite(sprites));
  const [spec, setSpec] = useState<StripSpec>(STRIP_START);
  const [result, setResult] = useState<StripResult>('cells');
  const [durationMs, setDurationMs] = useState(DURATION_START);
  const sprite = sprites.find((each) => each.id === spriteId) ?? null;
  const plan = useMemo(() => stripPlan(sprite, spec), [sprite, spec]);
  const ready = sprite !== null && plan.error === null && plan.cells.length > 0;
  return (
    <AddFramesShell
      title={ADD_TEXT.stripTitle}
      canAdd={ready}
      onAdd={() => {
        if (sprite) runAddFrames({ kind: 'strip', sprite: sprite.id, spec, cells: plan.cells.length, result, durationMs, at: insertAt(focus) });
      }}
    >
      <Stack gap="md">
        {sprites.length === 0 ? (
          <Text tone="muted">{ADD_TEXT.noSprites}</Text>
        ) : (
          <Field label={ADD_TEXT.pickSprite}>
            <Select
              options={sprites.map((each) => ({ value: each.id, label: `${each.name} (${each.width} by ${each.height})` }))}
              value={spriteId ?? ''}
              onChange={(value) => setSpriteId(value as SpriteId)}
              aria-label={ADD_TEXT.pickSprite}
            />
          </Field>
        )}
        {other > 0 && <Text tone="dim">{ADD_TEXT.otherPalette(other)}</Text>}
        <StripFields spec={spec} plan={plan} result={result} onSpec={(change) => setSpec((current) => ({ ...current, ...change }))} onResult={setResult} />
        <FrameModeFields mode={null} durationMs={durationMs} onMode={() => undefined} onDuration={setDurationMs} />
      </Stack>
    </AddFramesShell>
  );
};

export { StripDialog };
