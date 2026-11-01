/* @layer renderer-app @kind types */
import type { AssetKind } from '@bxel/document';
import type { OpenProject } from '../project/project.type';
import type { DuplicateId, LinkIndex, LinkState } from '../workspace/link-index.type';

type HealthCheck = 'broken' | 'moved' | 'unused' | 'misplaced' | 'duplicates' | 'unsaved' | 'access' | 'capped';

type LinkFinding = {
  readonly fix: string;
  readonly file: string;
  readonly fileName: string;
  readonly fileKind: AssetKind;
  readonly linkId: string;
  readonly targetName: string;
  readonly targetKind: AssetKind | null;
  readonly lastPath: string;
  readonly state: LinkState;
  readonly foundPath: string | null;
  readonly candidates: readonly string[];
};

type FileFinding = { readonly fix: string; readonly path: string; readonly name: string; readonly kind: AssetKind };

type MisplacedFinding = FileFinding & { readonly folder: string };

type AccessFinding = { readonly fix: string; readonly folderId: string; readonly name: string; readonly path: string };

type HealthReport = {
  readonly broken: readonly LinkFinding[];
  readonly moved: readonly LinkFinding[];
  readonly unused: readonly FileFinding[];
  readonly misplaced: readonly MisplacedFinding[];
  readonly duplicates: readonly DuplicateId[];
  readonly unsaved: number;
  readonly access: readonly AccessFinding[];
  readonly capped: readonly FileFinding[];
  readonly total: number;
  readonly files: number;
};

type HealthContext = { readonly project: OpenProject; readonly unsaved: number };

type HealthState =
  | { readonly status: 'idle' }
  | { readonly status: 'scanning' }
  | { readonly status: 'ready'; readonly report: HealthReport; readonly index: LinkIndex };

type LinkFix = { readonly file: string; readonly linkId: string; readonly by: 'id' | 'path' | 'remove'; readonly to?: string };

type FixOutcome = { readonly fixed: number; readonly skipped: readonly { readonly fix: LinkFix; readonly reason: string }[] };

export type { AccessFinding, FileFinding, FixOutcome, HealthCheck, HealthContext, HealthReport, HealthState, LinkFinding, LinkFix, MisplacedFinding };
