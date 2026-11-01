/* @layer renderer-app @kind types */
import type { FileAction } from '../files/files.type';
import type { LinkFinding } from '../project-health/project-health.type';
import type { WorkspaceLoading } from '../stores/workspace-store.type';
import type { StageSurface } from '../ui-context/bxel-context.type';

type StageFault = { readonly message: string; readonly action: FileAction };

type StageState =
  | { readonly kind: 'ready' }
  | { readonly kind: 'loading'; readonly progress: number | null; readonly done: number; readonly total: number }
  | { readonly kind: 'missing'; readonly links: readonly LinkFinding[] }
  | { readonly kind: 'error'; readonly fault: StageFault };

type StageStateInput = {
  readonly surface: StageSurface;
  readonly loading: WorkspaceLoading | null;
  readonly opening: boolean;
  readonly fault: StageFault | null;
  readonly broken: readonly LinkFinding[];
};

export type { StageFault, StageState, StageStateInput };
