/* @layer renderer-app @kind logic */
import { resizeActiveSprite } from '../../canvas-size/resize-active-sprite';
import { currentTarget } from '../../editor/current-target';
import { commitSpec } from '../../editor/pending/commit-spec';
import type { ResizeSpec } from '../../sheet-manager/manager.type';
import { runChange } from '../../palette-change/run-change';
import type { ChangeKind } from '../../palette-change/palette-change.type';
import { useDocumentStore } from '../../stores/useDocumentStore';

type Args = Readonly<Record<string, unknown>>;

type Direct = (args: Args) => string | null;

const NO_SPRITE = 'No sprite is open to change.';

const num = (args: Args, key: string): number => Number(args[key]);

const paletteChange = (kind: ChangeKind, swatch: number, other: number | null, cap: number | null): string | null => {
  const target = currentTarget();
  if (!target) return NO_SPRITE;
  const size = target.bank.slots.length;
  if (kind !== 'limit' && (swatch <= 0 || swatch >= size)) return `Swatch ${swatch} cannot be changed. Slot 0 is fixed and the palette has ${size} colours.`;
  if (other !== null && (other < 0 || other >= size || other === swatch)) return `Swatch ${other} is not a colour to merge into.`;
  const outcome = runChange(
    useDocumentStore.getState().host,
    { kind, documentId: target.documentId, bankId: target.bank.id, swatch, other, cap: cap ?? target.bank.cap },
    'commit',
  );
  return outcome.ok ? null : outcome.message;
};

const DIRECT: Readonly<Record<string, Direct>> = {
  'transform.rotate': (args) => commitSpec({ kind: 'rotate', angle: num(args, 'angle'), bounds: args.bounds === 'expand' ? 'expand' : 'crop' }),
  'transform.scale': (args) =>
    commitSpec({ kind: 'scale', width: num(args, 'width'), height: num(args, 'height'), bounds: args.bounds === 'expand' ? 'expand' : 'crop' }),
  'canvas.size': (args) =>
    resizeActiveSprite({ width: num(args, 'width'), height: num(args, 'height'), anchor: args.anchor as ResizeSpec['anchor'] }) ? null : 'The canvas size did not change.',
  'palette.delete_swatch': (args) => paletteChange('delete', num(args, 'index'), null, null),
  'palette.merge_swatch': (args) => paletteChange('merge', num(args, 'index'), num(args, 'into'), null),
  'palette.change_limit': (args) => paletteChange('limit', 0, null, num(args, 'cap')),
};

const directOf = (id: string): Direct | null => (Object.hasOwn(DIRECT, id) ? (DIRECT[id] ?? null) : null);

export { directOf };
