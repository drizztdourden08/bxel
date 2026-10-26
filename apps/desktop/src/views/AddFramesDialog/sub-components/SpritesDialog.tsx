/* @layer renderer-app @kind component */
import type { SpriteId } from '@bxel/document';
import { Checkbox, ScrollArea, Stack, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { ADD_TEXT, DURATION_START } from '../../../add-frames/add-frames.constants';
import type { FrameMode } from '../../../add-frames/add-frames.type';
import { eligibleSprites } from '../../../add-frames/eligible-sprites';
import { runAddFrames } from '../../../add-frames/run-add-frames';
import { insertAt } from '../../../timeline/insert-at';
import { FrameModeFields } from '../../FrameModeFields';
import type { FocusDialogProps } from '../AddFramesDialog.type';
import { AddFramesShell } from './AddFramesShell';

const SpritesDialog = ({ focus }: FocusDialogProps) => {
  const { sprites, other } = eligibleSprites(focus.artwork, focus.animation);
  const [picked, setPicked] = useState<readonly SpriteId[]>([]);
  const [mode, setMode] = useState<FrameMode>('reference');
  const [durationMs, setDurationMs] = useState(DURATION_START);
  const toggle = (id: SpriteId, on: boolean): void => setPicked((current) => (on ? [...current, id] : current.filter((each) => each !== id)));
  const ordered = sprites.filter((sprite) => picked.includes(sprite.id)).map((sprite) => sprite.id);
  return (
    <AddFramesShell
      title={ADD_TEXT.spritesTitle}
      canAdd={ordered.length > 0}
      onAdd={() => runAddFrames({ kind: 'sprites', sprites: ordered, mode, durationMs, at: insertAt(focus) })}
    >
      <Stack gap="md">
        {sprites.length === 0 ? (
          <Text tone="muted">{ADD_TEXT.noSprites}</Text>
        ) : (
          <ScrollArea axis="y" scrollbar="slim" aria-label={ADD_TEXT.pickSprites}>
            <Stack gap="xs">
              {sprites.map((sprite) => (
                <Checkbox key={sprite.id} label={sprite.name} checked={picked.includes(sprite.id)} onChange={(on) => toggle(sprite.id, on)} />
              ))}
            </Stack>
          </ScrollArea>
        )}
        {other > 0 && <Text tone="dim">{ADD_TEXT.otherPalette(other)}</Text>}
        <FrameModeFields mode={mode} durationMs={durationMs} onMode={setMode} onDuration={setDurationMs} />
        <Text tone="dim" aria-live="polite">{ordered.length === 0 ? ADD_TEXT.pickOne : ADD_TEXT.willAddSprites(ordered.length)}</Text>
      </Stack>
    </AddFramesShell>
  );
};

export { SpritesDialog };
