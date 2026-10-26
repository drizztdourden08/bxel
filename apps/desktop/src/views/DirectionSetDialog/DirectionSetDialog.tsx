/* @layer renderer-app @kind component */
import { FACING_SETS } from '@bxel/document';
import { Button, DialogShell, Stack, Text } from '@drizztdourden08/tessera';
import { useState } from 'react';
import { DIRECTION_START, DIRECTION_TEXT, MIRROR_PAIRS } from '../../direction-set/direction-set.constants';
import type { DirectionSetSpec } from '../../direction-set/direction-set.type';
import { runDirectionSet } from '../../direction-set/run-direction-set';
import { useAnimationFocus } from '../../hooks/useAnimationFocus';
import { useDirectionSetStore } from '../../stores/useDirectionSetStore';
import { DirectionFields } from './sub-components/DirectionFields';

const DirectionSetDialog = () => {
  const open = useDirectionSetStore((state) => state.open);
  const hide = useDirectionSetStore((state) => state.hide);
  const focus = useAnimationFocus();
  const [spec, setSpec] = useState<DirectionSetSpec>(DIRECTION_START);
  if (!open || !focus) return null;
  const update = (change: Partial<DirectionSetSpec>): void => setSpec((current) => ({ ...current, ...change }));
  const facings = FACING_SETS[spec.mode].length;
  const mirrors = spec.mirrored.filter((facing) => MIRROR_PAIRS[spec.mode].some((pair) => pair.mirrored === facing)).length;
  const valid = spec.tag.trim() !== '';
  const actions = (
    <>
      <Button variant="tertiary" onClick={hide}>
        {DIRECTION_TEXT.cancel}
      </Button>
      <Button
        variant="primary"
        disabled={!valid}
        onClick={() => {
          runDirectionSet({ ...spec, mirrored: spec.mirrored.filter((facing) => MIRROR_PAIRS[spec.mode].some((pair) => pair.mirrored === facing)) });
          hide();
        }}
      >
        {DIRECTION_TEXT.create}
      </Button>
    </>
  );
  return (
    <DialogShell open title={DIRECTION_TEXT.title} onClose={hide} actions={actions}>
      <Stack gap="md">
        <DirectionFields spec={spec} update={update} />
        <Text tone="dim" aria-live="polite">{DIRECTION_TEXT.willMake(facings - mirrors, (facings - mirrors) * spec.framesPerFacing, mirrors)}</Text>
        {focus.animation.frames.length > 1 && <Text tone="dim">{DIRECTION_TEXT.replaces}</Text>}
      </Stack>
    </DialogShell>
  );
};

export { DirectionSetDialog };
