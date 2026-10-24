/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { DocumentId, ArtworkId } from '../../model/ids.type';
import type { DocumentState, Artwork } from '../../model/artwork.type';
import { artworkCreateSchema } from '../../schema/artwork-create-schema';
import type { ArtworkCreateOptions } from '../../schema/command-options.type';
import { CommandFailure } from '../command-failure';
import { parseOptions } from '../parse-options';
import { buildSprite } from '../sprite/build-sprite';
import { buildBank } from './build-bank';
import type { ArtworkCreateResult } from './artwork-create.type';
import { validateArtworkCreate } from './validate-artwork-create';

const buildDocument = (options: ArtworkCreateOptions, ids: IdSource): DocumentState => {
  const artworkId = ids.next('art') as ArtworkId;
  const bank = buildBank(ids, options.bank);
  const first = options.sprite;
  const sprites = first
    ? [buildSprite({ ids, name: first.name.trim(), width: first.width, height: first.height, bankId: bank.id, pivot: null })]
    : [];
  const artwork: Artwork = {
    id: artworkId,
    name: options.name.trim(),
    defaultBankId: bank.id,
    coverSpriteId: null,
    ...(options.platformId === undefined ? {} : { platformId: options.platformId }),
    banks: [bank],
    sprites,
    sheets: [],
    presets: [],
    tilesets: [],
    tilemaps: [],
  };
  return { documentId: ids.next('doc') as DocumentId, revision: 1, artwork, readOnly: false };
};

const artworkCreate = ({ options, ids }: { options: unknown; ids: IdSource }): ArtworkCreateResult => {
  try {
    const parsed = parseOptions(artworkCreateSchema, options, 'options');
    validateArtworkCreate(parsed);
    return { ok: true, state: buildDocument(parsed, ids) };
  } catch (error) {
    if (error instanceof CommandFailure) return { ok: false, error: error.error };
    throw error;
  }
};

export { artworkCreate };
