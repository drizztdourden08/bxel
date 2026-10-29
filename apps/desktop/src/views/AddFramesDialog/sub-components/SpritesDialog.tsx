/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { useMemo, useState } from 'react';
import { ADD_TEXT, DURATION_START } from '../../../add-frames/add-frames.constants';
import type { FrameMode } from '../../../add-frames/add-frames.type';
import { eligibleSprites } from '../../../add-frames/eligible-sprites';
import { runAddFrames } from '../../../add-frames/run-add-frames';
import { spriteFacts } from '../../../sheet-manager/sprite-facts';
import { insertAt } from '../../../timeline/insert-at';
import { EntryBrowser } from '../../EntryBrowser';
import { FrameModeFields } from '../../FrameModeFields';
import type { FocusDialogProps } from '../AddFramesDialog.type';
import { AddFramesShell } from './AddFramesShell';

const SpritesDialog = ({ focus }: FocusDialogProps) => {
  const { sprites, other } = eligibleSprites(focus.artwork, focus.animation);
  const entries = useMemo(() => sprites.map((sprite) => spriteFacts(focus.artwork, sprite, null)), [focus.artwork, sprites]);
  const [picked, setPicked] = useState<readonly string[]>([]);
  const [mode, setMode] = useState<FrameMode>('reference');
  const [durationMs, setDurationMs] = useState(DURATION_START);
  const ordered = sprites.filter((sprite) => picked.includes(sprite.id)).map((sprite) => sprite.id);
  return (
    <AddFramesShell
      title={ADD_TEXT.spritesTitle}
      canAdd={ordered.length > 0}
      onAdd={() => runAddFrames({ kind: 'sprites', sprites: ordered, mode, durationMs, at: insertAt(focus) })}
    >
      <Stack gap="md">
        <EntryBrowser
          label={ADD_TEXT.pickSprites}
          artwork={focus.artwork}
          entries={entries}
          picked={picked}
          onPickedChange={setPicked}
          kinds={['sprites']}
          emptyMessage={ADD_TEXT.noSprites}
          className="entry-browser--tall"
        />
        {other > 0 && <Text tone="dim">{ADD_TEXT.otherPalette(other)}</Text>}
        <FrameModeFields mode={mode} durationMs={durationMs} onMode={setMode} onDuration={setDurationMs} />
        <Text tone="dim" aria-live="polite">{ordered.length === 0 ? ADD_TEXT.pickOne : ADD_TEXT.willAddSprites(ordered.length)}</Text>
      </Stack>
    </AddFramesShell>
  );
};

export { SpritesDialog };
