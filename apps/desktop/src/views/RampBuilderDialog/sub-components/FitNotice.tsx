/* @layer renderer-app @kind component */
import { Button, Callout, Flex, Text } from '@drizztdourden08/tessera';
import { RAMP_TEXT } from '../../../palette-ramps/palette-ramps.constants';
import { BUILDER_TEXT, REUSE_MORE, SNAP_TOP } from '../RampBuilderDialog.constants';
import type { BuilderPartProps } from '../RampBuilderDialog.type';

const FitNotice = ({ state }: BuilderPartProps) => {
  const { build, free, fits, room, settings, change } = state;
  if (!build) return null;
  if (fits && settings.raise !== null) return <Text variant="caption" tone="muted">{BUILDER_TEXT.raised(build.added, settings.raise)}</Text>;
  if (fits) return <Text variant="caption" tone="muted">{RAMP_TEXT.fits(build.added, free)}</Text>;
  const wider = Math.min(SNAP_TOP, Math.max(REUSE_MORE, settings.snapDistance + REUSE_MORE));
  const action = (
    <Flex gap="xs" wrap>
      {room !== null && (
        <Button size="sm" variant="secondary" onClick={() => change({ raise: room })}>
          {BUILDER_TEXT.raise(room)}
        </Button>
      )}
      <Button size="sm" variant="tertiary" disabled={settings.snap && settings.snapDistance >= SNAP_TOP} onClick={() => change({ snap: true, snapDistance: wider })}>
        {BUILDER_TEXT.reuseMore}
      </Button>
    </Flex>
  );
  return (
    <Callout tone="danger" details={action}>
      {RAMP_TEXT.noRoom(build.added, free)}
    </Callout>
  );
};

export { FitNotice };
