/* @layer renderer-app @kind types */
import type { ProjectOrganise } from '@bxel/project';

type OrganiseOp =
  | { readonly op: 'tag'; readonly assets: readonly string[]; readonly tags: readonly string[] }
  | { readonly op: 'untag'; readonly assets: readonly string[]; readonly tags: readonly string[] }
  | { readonly op: 'pin'; readonly assets: readonly string[] }
  | { readonly op: 'unpin'; readonly assets: readonly string[] }
  | { readonly op: 'forget'; readonly assets: readonly string[] }
  | { readonly op: 'collect'; readonly assets: readonly string[]; readonly collection: string }
  | { readonly op: 'uncollect'; readonly assets: readonly string[]; readonly collection: string }
  | { readonly op: 'newCollection'; readonly name: string; readonly assets?: readonly string[] }
  | { readonly op: 'renameCollection'; readonly collection: string; readonly name: string }
  | { readonly op: 'deleteCollection'; readonly collection: string }
  | { readonly op: 'saveSearch'; readonly name: string; readonly query: string }
  | { readonly op: 'removeSearch'; readonly search: string };

type OrganiseChange = { readonly ok: true; readonly organise: ProjectOrganise; readonly note: string } | { readonly ok: false; readonly message: string };

type OrganiseOutcome = { readonly ok: true; readonly note: string } | { readonly ok: false; readonly message: string };

type OpHandler<Op extends OrganiseOp = OrganiseOp> = (organise: ProjectOrganise, op: Op) => OrganiseChange;

type OrganiseHandlers = { readonly [Name in OrganiseOp['op']]: OpHandler<Extract<OrganiseOp, { op: Name }>> };

export type { OpHandler, OrganiseChange, OrganiseHandlers, OrganiseOp, OrganiseOutcome };
