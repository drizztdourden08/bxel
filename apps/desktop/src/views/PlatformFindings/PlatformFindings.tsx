/* @layer renderer-app @kind component */
import { Callout, Stack, Text } from '@drizztdourden08/tessera';
import { PLATFORM_TEXT, TIER_LABELS } from '../../platform-preset/platform-preset.constants';
import { FINDING_TONES } from './PlatformFindings.constants';
import type { PlatformFindingsProps } from './PlatformFindings.type';

const PlatformFindings = ({ report }: PlatformFindingsProps) => (
  <Stack gap="xs" aria-live="polite">
    <Text variant="caption" tone="muted">
      {report.rules}
    </Text>
    {report.findings.length === 0 && (
      <Text variant="caption" tone="muted">
        {PLATFORM_TEXT.noFindings}
      </Text>
    )}
    {report.findings.map((finding) => (
      <Callout key={`${finding.tier}:${finding.text}`} variant="footnote" tone={FINDING_TONES[finding.tier]}>
        {`${TIER_LABELS[finding.tier]}: ${finding.text}`}
      </Callout>
    ))}
  </Stack>
);

export { PlatformFindings };
