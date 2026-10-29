/* @layer renderer-app @kind constants */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import type { Builder } from './organise-op-builders.type';

const missing = (field: string, op: string): Failure => mcpFailure(MCP_ERROR_CODE.COMMAND_ARGS, `${op} needs ${field}.`, { path: field });

const needsFiles = (op: string, assets: readonly string[]): Failure | null => (assets.length > 0 ? null : missing('files or assets', op));

const tagging =
  (op: 'tag' | 'untag'): Builder =>
  (request, assets) => {
    const absent = needsFiles(op, assets);
    if (absent) return absent;
    const tags = request.tags ?? [];
    return op === 'tag' && tags.length === 0 ? missing('tags', op) : { op, assets, tags };
  };

const pinning =
  (op: 'pin' | 'unpin'): Builder =>
  (_request, assets) =>
    needsFiles(op, assets) ?? { op, assets };

const collecting =
  (op: 'collect' | 'uncollect'): Builder =>
  (request, assets) => {
    const absent = needsFiles(op, assets);
    if (absent) return absent;
    return request.collection === undefined ? missing('collection', op) : { op, assets, collection: request.collection };
  };

const ORGANISE_BUILDERS: Readonly<Record<string, Builder>> = {
  tag: tagging('tag'),
  untag: tagging('untag'),
  pin: pinning('pin'),
  unpin: pinning('unpin'),
  collect: collecting('collect'),
  uncollect: collecting('uncollect'),
  newCollection: (request, assets) => (request.name === undefined ? missing('name', 'newCollection') : { op: 'newCollection', name: request.name, assets }),
  renameCollection: (request) => {
    if (request.collection === undefined) return missing('collection', 'renameCollection');
    return request.name === undefined ? missing('name', 'renameCollection') : { op: 'renameCollection', collection: request.collection, name: request.name };
  },
  deleteCollection: (request) => (request.collection === undefined ? missing('collection', 'deleteCollection') : { op: 'deleteCollection', collection: request.collection }),
  saveSearch: (request) => {
    if (request.name === undefined) return missing('name', 'saveSearch');
    return request.query === undefined ? missing('query', 'saveSearch') : { op: 'saveSearch', name: request.name, query: request.query };
  },
  removeSearch: (request) => (request.search === undefined ? missing('search', 'removeSearch') : { op: 'removeSearch', search: request.search }),
};

export { ORGANISE_BUILDERS };
