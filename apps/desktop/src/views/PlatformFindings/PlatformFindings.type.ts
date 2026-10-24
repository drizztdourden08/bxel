/* @layer renderer-app @kind types */
import type { AreaHighlight, FindingLine, PlatformReport } from '../../platform-preset/platform-preset.type';

interface PlatformFindingsProps {
  report: PlatformReport;
}

interface AreaFindingsModel {
  selected: string | null;
  toggle: (area: AreaHighlight) => void;
}

interface FindingRowProps {
  finding: FindingLine;
  areas: AreaFindingsModel;
}

export type { AreaFindingsModel, FindingRowProps, PlatformFindingsProps };
