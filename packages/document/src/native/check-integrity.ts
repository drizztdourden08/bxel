/* @layer core @kind logic */
import { checkBanks } from './check-banks';
import { checkReferences } from './check-references';
import { checkSpriteReferences } from './check-sprite-references';
import { checkTilesets } from './check-tilesets';
import { checkUniqueIds } from './check-unique-ids';
import { MAX_REPORTED_ISSUES } from './container.constants';
import type { DocumentJson } from './document-json.type';
import type { ExternalIds } from './external-ids.type';
import type { LoadIssue } from './load-report.type';

const checkIntegrity = (document: DocumentJson, external?: ExternalIds): readonly LoadIssue[] =>
  [
    ...checkUniqueIds(document),
    ...checkReferences(document, external),
    ...checkSpriteReferences(document),
    ...checkBanks(document),
    ...checkTilesets(document),
  ].slice(0, MAX_REPORTED_ISSUES);

export { checkIntegrity };
