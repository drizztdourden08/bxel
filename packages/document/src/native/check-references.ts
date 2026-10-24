/* @layer core @kind logic */
import type { DocumentJson } from './document-json.type';
import type { ExternalIds } from './external-ids.type';
import type { KnownIds } from './known-ids.type';
import type { LoadIssue } from './load-report.type';
import { missingReference } from './missing-reference';

const sheetIssues = (document: DocumentJson, known: KnownIds): readonly LoadIssue[] =>
  document.sheets.flatMap((sheet, index) =>
    sheet.entries.flatMap((entry, entryIndex) =>
      missingReference(known.sprites, entry.spriteId, 'sprite', `$.sheets[${index}].entries[${entryIndex}].spriteId`),
    ),
  );

const presetIssues = (document: DocumentJson, known: KnownIds): readonly LoadIssue[] =>
  document.presets.flatMap((preset, index) => [
    ...missingReference(known.sheets, preset.sheetId, 'sheet', `$.presets[${index}].sheetId`),
    ...preset.scope.sprites.flatMap((ref, refIndex) =>
      typeof ref === 'string'
        ? missingReference(known.sprites, ref, 'sprite', `$.presets[${index}].scope.sprites[${refIndex}]`)
        : [],
    ),
  ]);

const tilesetIssues = (document: DocumentJson, known: KnownIds): readonly LoadIssue[] =>
  document.tilesets.flatMap((tileset, index) => [
    ...missingReference(known.banks, tileset.bankId, 'bank', `$.tilesets[${index}].bankId`),
    ...tileset.tiles.flatMap((tile, tileIndex) =>
      missingReference(known.sprites, tile.spriteId, 'sprite', `$.tilesets[${index}].tiles[${tileIndex}].spriteId`),
    ),
  ]);

const tilemapIssues = (document: DocumentJson, known: KnownIds): readonly LoadIssue[] =>
  document.tilemaps.flatMap((tilemap, index) =>
    missingReference(known.tilesets, tilemap.tilesetId, 'tileset', `$.tilemaps[${index}].tilesetId`),
  );

const knownIds = (document: DocumentJson, external: ExternalIds | undefined): KnownIds => ({
  banks: new Set([...document.banks.map((bank) => bank.id), ...(external?.banks ?? [])]),
  sprites: new Set([...document.sprites.map((sprite) => sprite.id), ...(external?.sprites ?? [])]),
  sheets: new Set(document.sheets.map((sheet) => sheet.id)),
  tilesets: new Set([...document.tilesets.map((tileset) => tileset.id), ...(external?.tilesets ?? [])]),
});

const rootIssues = (document: DocumentJson, known: KnownIds): readonly LoadIssue[] => [
  ...missingReference(known.banks, document.defaultBankId, 'bank', '$.defaultBankId'),
  ...missingReference(known.sprites, document.coverSpriteId, 'sprite', '$.coverSpriteId'),
];

const checkReferences = (document: DocumentJson, external?: ExternalIds): readonly LoadIssue[] => {
  const known = knownIds(document, external);
  return [
    ...(external === undefined ? rootIssues(document, known) : []),
    ...sheetIssues(document, known),
    ...presetIssues(document, known),
    ...tilesetIssues(document, known),
    ...tilemapIssues(document, known),
  ];
};

export { checkReferences };
