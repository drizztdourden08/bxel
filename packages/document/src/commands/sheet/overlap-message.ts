/* @layer core @kind logic */
import type { Artwork } from '../../model/artwork.type';
import { requireSprite } from '../../read/require-sprite';
import type { SheetPart, SheetPartOverlap } from '../../sheet/sheet-overlap.type';

const nameOf = (artwork: Artwork, part: SheetPart): string => {
  if (part.kind === 'sprite') return requireSprite(artwork, part.spriteId).name;
  const animation = artwork.animations.find((item) => item.id === part.animationId);
  const tag = animation?.tags.find((item) => item.id === part.tagId);
  return tag?.kind === 'span' ? `${animation?.name ?? ''} ${tag.name}` : (animation?.name ?? '');
};

const labelOf = (artwork: Artwork, part: SheetPart): string => `${part.kind} "${nameOf(artwork, part)}"`;

const overlapMessage = (artwork: Artwork, sheetName: string, { first, second }: SheetPartOverlap): string => {
  if (first.kind === 'sprite' && second.kind === 'sprite') {
    return `Sprites "${nameOf(artwork, first)}" and "${nameOf(artwork, second)}" overlap on sheet "${sheetName}".`;
  }
  const lead = labelOf(artwork, first);
  return `${lead.charAt(0).toUpperCase()}${lead.slice(1)} and ${labelOf(artwork, second)} overlap on sheet "${sheetName}".`;
};

export { overlapMessage };
