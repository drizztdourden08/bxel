/* @layer renderer-app @kind component */
import { Stack, Text } from '@drizztdourden08/tessera';
import { PLATFORM_TEXT } from '../../platform-preset/platform-preset.constants';
import { useAreaFindings } from './behavior/useAreaFindings';
import type { PlatformFindingsProps } from './PlatformFindings.type';
import { FindingRow } from './sub-components/FindingRow';

const PlatformFindings = ({ report }: PlatformFindingsProps) => {
  const areas = useAreaFindings(report);
  return (
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
        <FindingRow key={`${finding.tier}:${finding.text}`} finding={finding} areas={areas} />
      ))}
    </Stack>
  );
};

export { PlatformFindings };
