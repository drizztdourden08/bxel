/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { readNativeAssets } from '../../src/asset-drag/read-native-assets';
import { dropKind } from '../../src/file-ops/drop-kind';
import { moveTargets } from '../../src/project-browser/move-targets';
import { splitTags } from '../../src/properties-subject/split-tags';
import { quickOpenOptions } from '../../src/quick-open/quick-open-options';

const ROOTS = [{ path: '/p/art', name: 'art', linked: false }];

const item = (id: string, assetId: string | null) => ({ id, name: id, path: `/p/art/${id}`, kind: 'Sprite', assetId, folder: false });

const listed = (path: string) => ({ path, name: path.slice(path.lastIndexOf('/') + 1), modified: 1, size: 1 });

describe('K1 quick open choices', { tags: ['critical'] }, () => {
  it('lists the files that open, by name with their folder, and skips data and palette text files', () => {
    const options = quickOpenOptions(
      [listed('/p/art/hero.bxsprite'), listed('/p/art/sub/tree.bxsprite'), listed('/p/art/notes.json'), listed('/p/art/pal.gpl'), listed('/p/art/readme.txt'), listed('/p/art/logo.png')],
      ['/p/art'],
    );
    expect(options.map((option) => option.label)).toEqual(['hero.bxsprite', 'logo.png', 'tree.bxsprite (sub)']);
    expect(options.map((option) => option.value)).toContain('/p/art/sub/tree.bxsprite');
  });
});

describe('K1 the Move to folder list', { tags: ['critical'] }, () => {
  it('offers the roots and folders but never a moved folder or anything inside it', () => {
    const targets = moveTargets(ROOTS, ['/p/art/a', '/p/art/a/deep', '/p/art/b'], ['/p/art/a']);
    expect(targets.map((target) => target.label)).toEqual(['art', 'art/b']);
  });

  it('names each folder from its root', () => {
    expect(moveTargets(ROOTS, ['/p/art/b'], []).map((target) => target.path)).toEqual(['/p/art', '/p/art/b']);
  });
});

describe('K1 files dropped from the operating system', { tags: ['critical'] }, () => {
  it('sends images to the import wizard, palette files to a palette, and the rest to a plain copy', () => {
    expect(dropKind(new File([], 'a.png', { type: 'image/png' }))).toBe('image');
    expect(dropKind(new File([], 'colors.GPL'))).toBe('palette');
    expect(dropKind(new File([], 'hero.bxsprite'))).toBe('copy');
  });
});

describe('K1 dragged project entries read back for the tab strip', { tags: ['critical'] }, () => {
  it('reads the assets and ignores anything malformed', () => {
    const text = JSON.stringify([{ id: 'a', kind: 'sprite', assetId: 'x', path: '/p/a.bxsprite' }, { id: 1 }, null]);
    expect(readNativeAssets(text)).toEqual([{ id: 'a', kind: 'sprite', assetId: 'x', path: '/p/a.bxsprite' }]);
    expect(readNativeAssets('not json')).toEqual([]);
  });
});

describe('K1 tags of a multi selection', { tags: ['critical'] }, () => {
  it('splits tags held by every taggable file from tags held by some, and skips untaggable entries', () => {
    const tags = { a1: ['hero', 'boss'], b1: ['hero'] };
    const split = splitTags([item('a', 'a1'), item('b', 'b1'), item('folder', null)], tags);
    expect(split).toEqual({ shared: ['hero'], partial: ['boss'] });
  });

  it('has no tags when nothing is taggable', () => {
    expect(splitTags([item('folder', null)], {})).toEqual({ shared: [], partial: [] });
  });
});
