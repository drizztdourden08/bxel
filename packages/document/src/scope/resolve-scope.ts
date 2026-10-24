/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { CommandWarning } from '../commands/result.type';
import { requireSprite } from '../read/require-sprite';
import { resolveSpriteCels } from './resolve-sprite-cels';
import { resolveSprites } from './resolve-sprites';
import type { ResolveScopeInput, ResolvedScope } from './resolved-scope.type';

const resolveScope = ({ artwork, scope, created, step }: ResolveScopeInput): ResolvedScope => {
  const sprites = resolveSprites({ artwork, refs: scope.sprites, created });
  const manySprites = sprites.length > 1;
  if (manySprites && (scope.layers.by === 'ids' || scope.frames.by === 'ids')) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'Layer and frame ids are valid with one sprite only. Use names, range or all.', {
      path: 'targets',
    });
  }
  const parts = sprites.map((id) => ({ id, ...resolveSpriteCels(requireSprite(artwork, id), scope, step) }));
  const empty = parts.filter((part) => part.cels.length === 0);
  if (empty.length > 0) {
    const details = empty.map((part) => ({ spriteId: part.id, layerId: null, frameId: null, reason: 'no cel matches' }));
    const code = manySprites ? ERROR_CODE.INCOMPATIBLE_TARGETS : ERROR_CODE.TARGET_EMPTY;
    throw fail(code, 'The target scope resolves to no cel for some sprites.', { details });
  }
  const warnings: CommandWarning[] = parts.flatMap((part) => [...part.warnings]);
  return { sprites, cels: parts.flatMap((part) => [...part.cels]), warnings };
};

export { resolveScope };
