/* @layer renderer-app @kind component */
import { Button, Callout } from '@drizztdourden08/tessera';
import { AREA_TEXT, TIER_LABELS } from '../../../platform-preset/platform-preset.constants';
import { FINDING_TONES } from '../PlatformFindings.constants';
import type { FindingRowProps } from '../PlatformFindings.type';

const FindingRow = ({ finding, areas }: FindingRowProps) => {
  const { area } = finding;
  const shown = areas.selected !== null && areas.selected === area?.key;
  const action =
    area === undefined ? undefined : (
      <Button size="xs" variant="secondary" active={shown} aria-pressed={shown} onClick={() => areas.toggle(area)}>
        {shown ? AREA_TEXT.hide : AREA_TEXT.show}
      </Button>
    );
  return (
    <Callout variant="footnote" tone={FINDING_TONES[finding.tier]} action={action}>
      {`${TIER_LABELS[finding.tier]}: ${finding.text}`}
    </Callout>
  );
};

export { FindingRow };
