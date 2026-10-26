/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import type { CreateInput } from './tool-input.type';

const created = (artwork: Artwork, request: CreateInput): { readonly kind: CreateInput['kind']; readonly id: string } | null => {
  const named = <T extends { readonly id: string; readonly name: string }>(items: readonly T[], name: string): string | undefined => items.find((item) => item.name === name)?.id;
  const found: Readonly<Record<CreateInput['kind'], string | undefined>> = {
    sprite: artwork.sprites.find((sprite) => sprite.role === 'sprite')?.id,
    animation: named(artwork.animations, request.name),
    sheet: named(artwork.sheets, request.name),
    palette: artwork.banks[0]?.id,
    tileset: named(artwork.tilesets, request.name),
    tilemap: named(artwork.tilemaps, request.name),
  };
  const id = found[request.kind];
  return id === undefined ? null : { kind: request.kind, id };
};

export { created };
