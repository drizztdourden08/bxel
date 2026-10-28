/* @layer renderer-app @kind constants */
import type { FileType, SelectionKind, StageSurface } from './bxel-context.type';
import type { Pred } from './ui-rule.type';

const file =
  (...types: readonly FileType[]): Pred =>
  (context) =>
    types.includes(context.fileType);

const surface =
  (...surfaces: readonly StageSurface[]): Pred =>
  (context) =>
    surfaces.includes(context.surface);

const has =
  (...kinds: readonly SelectionKind[]): Pred =>
  (context) =>
    kinds.includes(context.selection);

const clip =
  (kind: 'pixels' | 'cells'): Pred =>
  (context) =>
    context.clipboard === kind;

const all =
  (...preds: readonly Pred[]): Pred =>
  (context) =>
    preds.every((pred) => pred(context));

const any =
  (...preds: readonly Pred[]): Pred =>
  (context) =>
    preds.some((pred) => pred(context));

const not =
  (pred: Pred): Pred =>
  (context) =>
    !pred(context);

const always: Pred = () => true;

const never: Pred = () => false;

const writable: Pred = (context) => !context.readOnly;

const hasDocument: Pred = (context) => context.fileType !== 'none' && context.fileType !== 'image';

const hasFile: Pred = (context) => context.fileType !== 'none';

const isolated: Pred = (context) => context.isolated;

const canUndo: Pred = (context) => context.canUndo;

const canRedo: Pred = (context) => context.canRedo;

const projectOpen: Pred = (context) => context.projectOpen;

const animatedTile: Pred = (context) => context.animatedTile;

export { all, always, animatedTile, any, canRedo, canUndo, clip, file, has, hasDocument, hasFile, isolated, never, not, projectOpen, surface, writable };
