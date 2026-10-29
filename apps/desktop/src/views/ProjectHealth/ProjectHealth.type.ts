/* @layer renderer-app @kind types */
import type { AssetKind } from '@bxel/document';
import type { AccessFinding, FileFinding, HealthReport, LinkFinding, MisplacedFinding } from '../../project-health/project-health.type';

type HealthActions = {
  readonly fixLink: (finding: LinkFinding, by: 'id' | 'remove') => void;
  readonly fixMoved: () => void;
  readonly show: (path: string) => void;
  readonly showUnsaved: () => void;
  readonly showUnused: () => void;
  readonly trashUnused: (findings: readonly FileFinding[]) => void;
  readonly moveToRole: (findings: readonly MisplacedFinding[]) => void;
  readonly regrant: (finding: AccessFinding) => void;
  readonly recheck: () => void;
};

type ReportProps = { readonly report: HealthReport; readonly actions: HealthActions };

type KindProps = { readonly kind: AssetKind | null };

export type { HealthActions, KindProps, ReportProps };
