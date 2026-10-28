/* @layer renderer-app @kind component */
import { Box, Callout, Flex, Stack, Text } from '@drizztdourden08/tessera';
import { RAMP_TEXT } from '../../../palette-ramps/palette-ramps.constants';
import { SphereTest } from '../../SphereTest';
import { SwatchStrip } from '../../SwatchStrip';
import { BUILDER_TEXT } from '../RampBuilderDialog.constants';
import type { BuilderPartProps } from '../RampBuilderDialog.type';

const BuilderPreview = ({ state }: BuilderPartProps) => {
  const { build, free, fits } = state;
  if (!build) return <Callout tone="warning">{BUILDER_TEXT.noBase}</Callout>;
  const colours = build.steps.map((step) => step.hex);
  const captions = build.steps.map((step) => (step.reuses === null ? BUILDER_TEXT.stepNew : BUILDER_TEXT.stepReuses(step.reuses)));
  return (
    <Stack gap="sm" className="ramp-builder__preview">
      <Flex gap="md" align="center">
        <SphereTest size="lg" colours={colours} label={BUILDER_TEXT.sphere} />
        <Box className="ramp-builder__strip">
          <SwatchStrip size="lg" colours={colours} captions={captions} label={BUILDER_TEXT.preview} />
        </Box>
      </Flex>
      <Box role="list" aria-label={BUILDER_TEXT.preview} className="ramp-builder__steps">
        {build.steps.map((step, at) => (
          <Text key={step.offset} role="listitem" variant="caption" className="ramp-builder__step">
            {BUILDER_TEXT.stepName(at + 1, build.steps.length, step.reuses)}
          </Text>
        ))}
      </Box>
      {fits ? (
        <Text variant="caption" tone="muted">{RAMP_TEXT.fits(build.added, free)}</Text>
      ) : (
        <Callout tone="danger">{RAMP_TEXT.noRoom(build.added, free)}</Callout>
      )}
    </Stack>
  );
};

export { BuilderPreview };
