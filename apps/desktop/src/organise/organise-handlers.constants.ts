/* @layer renderer-app @kind constants */
import { ORGANISE_LIMITS } from '@bxel/project';
import type { OrganiseCollection, OrganiseSearch, ProjectOrganise } from '@bxel/project';
import { cleanName } from './clean-name';
import { cleanTag } from './clean-tag';
import { findCollection } from './find-collection';
import { ORGANISE_TEXT } from './organise.constants';
import type { OrganiseChange, OrganiseHandlers } from './organise.type';
import { organiseId } from './organise-id';

const unique = (ids: readonly string[]): string[] => [...new Set(ids)];

const done = (organise: ProjectOrganise, note: string): OrganiseChange => ({ ok: true, organise, note });

const refuse = (message: string): OrganiseChange => ({ ok: false, message });

const cleanTags = (tags: readonly string[]): readonly string[] | string => {
  const cleaned: string[] = [];
  for (const tag of tags) {
    const one = cleanTag(tag);
    if (one === null) return ORGANISE_TEXT.badTag(tag);
    cleaned.push(one);
  }
  return unique(cleaned);
};

const namesOf = (names: readonly string[]): string[] => [...new Map(names.map((name) => [name.toLowerCase(), name] as const)).values()];

const withTags = (organise: ProjectOrganise, assets: readonly string[], change: (held: readonly string[]) => readonly string[]): ProjectOrganise => {
  const tags: Record<string, readonly string[]> = { ...organise.tags };
  for (const id of assets) {
    const next = change(tags[id] ?? []);
    if (next.length === 0) delete tags[id];
    else tags[id] = next;
  }
  return { ...organise, tags };
};

const inCollections = (organise: ProjectOrganise, change: (collection: OrganiseCollection) => OrganiseCollection): ProjectOrganise => ({
  ...organise,
  collections: organise.collections.map(change),
});

const sameName = (left: string, right: string): boolean => left.toLowerCase() === right.toLowerCase();

const ORGANISE_HANDLERS: OrganiseHandlers = {
  tag: (organise, op) => {
    const tags = cleanTags(op.tags);
    if (typeof tags === 'string') return refuse(tags);
    if (tags.length === 0) return refuse(ORGANISE_TEXT.noTags);
    const next = withTags(organise, op.assets, (held) => namesOf([...held, ...tags]).slice(0, ORGANISE_LIMITS.tagsPerAsset));
    return Object.keys(next.tags).length > ORGANISE_LIMITS.taggedMax ? refuse(ORGANISE_TEXT.tooMany) : done(next, ORGANISE_TEXT.tagged(op.assets.length, tags.length));
  },
  untag: (organise, op) => {
    const tags = cleanTags(op.tags);
    if (typeof tags === 'string') return refuse(tags);
    const next = withTags(organise, op.assets, (held) => (tags.length === 0 ? [] : held.filter((each) => !tags.some((tag) => sameName(tag, each)))));
    return done(next, ORGANISE_TEXT.untagged(op.assets.length));
  },
  pin: (organise, op) => {
    const pinned = unique([...organise.pinned, ...op.assets]);
    return pinned.length > ORGANISE_LIMITS.pinnedMax ? refuse(ORGANISE_TEXT.tooMany) : done({ ...organise, pinned }, ORGANISE_TEXT.pinned(op.assets.length));
  },
  unpin: (organise, op) => done({ ...organise, pinned: organise.pinned.filter((id) => !op.assets.includes(id)) }, ORGANISE_TEXT.unpinned(op.assets.length)),
  collect: (organise, op) => {
    const found = findCollection(organise, op.collection);
    if (!found) return refuse(ORGANISE_TEXT.noCollection(op.collection));
    const assets = unique([...found.assets, ...op.assets]);
    if (assets.length > ORGANISE_LIMITS.assetsPerCollection) return refuse(ORGANISE_TEXT.tooMany);
    return done(inCollections(organise, (each) => (each.id === found.id ? { ...each, assets } : each)), ORGANISE_TEXT.collected(op.assets.length, found.name));
  },
  uncollect: (organise, op) => {
    const found = findCollection(organise, op.collection);
    if (!found) return refuse(ORGANISE_TEXT.noCollection(op.collection));
    const next = inCollections(organise, (each) => (each.id === found.id ? { ...each, assets: each.assets.filter((id) => !op.assets.includes(id)) } : each));
    return done(next, ORGANISE_TEXT.uncollected(op.assets.length, found.name));
  },
  newCollection: (organise, op) => {
    const name = cleanName(op.name);
    if (name === null) return refuse(ORGANISE_TEXT.badName);
    if (organise.collections.some((each) => sameName(each.name, name))) return refuse(ORGANISE_TEXT.collectionNameTaken(name));
    if (organise.collections.length >= ORGANISE_LIMITS.collectionsMax) return refuse(ORGANISE_TEXT.tooMany);
    const made: OrganiseCollection = { id: organiseId('col'), name, assets: unique(op.assets ?? []) };
    return done({ ...organise, collections: [...organise.collections, made] }, ORGANISE_TEXT.newCollection(name));
  },
  renameCollection: (organise, op) => {
    const found = findCollection(organise, op.collection);
    const name = cleanName(op.name);
    if (!found) return refuse(ORGANISE_TEXT.noCollection(op.collection));
    if (name === null) return refuse(ORGANISE_TEXT.badName);
    if (organise.collections.some((each) => each.id !== found.id && sameName(each.name, name))) return refuse(ORGANISE_TEXT.collectionNameTaken(name));
    return done(inCollections(organise, (each) => (each.id === found.id ? { ...each, name } : each)), ORGANISE_TEXT.renamedCollection(name));
  },
  deleteCollection: (organise, op) => {
    const found = findCollection(organise, op.collection);
    if (!found) return refuse(ORGANISE_TEXT.noCollection(op.collection));
    return done({ ...organise, collections: organise.collections.filter((each) => each.id !== found.id) }, ORGANISE_TEXT.deletedCollection(found.name));
  },
  saveSearch: (organise, op) => {
    const name = cleanName(op.name);
    const query = cleanName(op.query, ORGANISE_LIMITS.queryMax);
    if (name === null) return refuse(ORGANISE_TEXT.badName);
    if (query === null) return refuse(ORGANISE_TEXT.badQuery);
    if (organise.smart.length >= ORGANISE_LIMITS.smartMax) return refuse(ORGANISE_TEXT.tooMany);
    const same = organise.smart.find((each) => sameName(each.name, name));
    if (same?.query === query) return done(organise, ORGANISE_TEXT.savedSearch(name));
    if (same) return refuse(ORGANISE_TEXT.searchNameTaken(name));
    const made: OrganiseSearch = { id: organiseId('smart'), name, query };
    return done({ ...organise, smart: [...organise.smart, made] }, ORGANISE_TEXT.savedSearch(name));
  },
  removeSearch: (organise, op) => {
    const wanted = op.search.trim().toLowerCase();
    const found = organise.smart.find((each) => each.id === op.search || each.name.toLowerCase() === wanted);
    if (!found) return refuse(ORGANISE_TEXT.noSearch(op.search));
    return done({ ...organise, smart: organise.smart.filter((each) => each.id !== found.id) }, ORGANISE_TEXT.removedSearch(found.name));
  },
  forget: (organise, op) => {
    const gone = new Set(op.assets);
    const next = withTags(organise, op.assets, () => []);
    return done(
      { ...next, pinned: next.pinned.filter((id) => !gone.has(id)), collections: next.collections.map((each) => ({ ...each, assets: each.assets.filter((id) => !gone.has(id)) })) },
      ORGANISE_TEXT.forgot(op.assets.length),
    );
  },
};

export { ORGANISE_HANDLERS };
