/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addReferenceImage } from '../../src/reference-image/add-reference-image';
import { currentReferences } from '../../src/reference-image/current-references';
import { REFERENCE_DEFAULTS, REFERENCE_LIMITS } from '../../src/reference-image/reference-image.constants';
import { removeReferenceImage } from '../../src/reference-image/remove-reference-image';
import { updateReferenceImage } from '../../src/reference-image/update-reference-image';
import { useAssetViewStore } from '../../src/stores/useAssetViewStore';

vi.mock('../../src/reference-image/current-view-key', () => ({ currentViewKey: () => 'sprite:a' }));

describe('K1 reference images of an asset', { tags: ['standard'] }, () => {
  beforeEach(() => {
    useAssetViewStore.setState({ views: {} });
  });

  it('adds a reference with the defaults and keeps it on the asset only', () => {
    const id = addReferenceImage({ key: 'C:/art/pose.png', name: 'pose.png' });
    expect(id).not.toBeNull();
    expect(currentReferences()).toEqual([{ id, key: 'C:/art/pose.png', name: 'pose.png', ...REFERENCE_DEFAULTS }]);
  });

  it('refuses a reference past the limit', () => {
    for (let count = 0; count < REFERENCE_LIMITS.count; count += 1) addReferenceImage({ key: `k${count}`, name: `n${count}` });
    expect(addReferenceImage({ key: 'extra', name: 'extra' })).toBeNull();
    expect(currentReferences()).toHaveLength(REFERENCE_LIMITS.count);
  });

  it('clamps scale, opacity and offset when a reference changes', () => {
    const id = addReferenceImage({ key: 'k', name: 'n' }) ?? '';
    expect(updateReferenceImage(id, { scale: 99999, opacity: -5, x: 1e9, y: 3.4 })).toBe(true);
    expect(currentReferences()[0]).toMatchObject({
      scale: REFERENCE_LIMITS.scale.max,
      opacity: REFERENCE_LIMITS.opacity.min,
      x: REFERENCE_LIMITS.offset.max,
      y: 3,
    });
  });

  it('changes the order of painting and lock without touching the rest', () => {
    const id = addReferenceImage({ key: 'k', name: 'n' }) ?? '';
    updateReferenceImage(id, { above: false, locked: true });
    expect(currentReferences()[0]).toMatchObject({ above: false, locked: true, opacity: REFERENCE_DEFAULTS.opacity });
  });

  it('removes a reference by id and reports an unknown id', () => {
    const first = addReferenceImage({ key: 'a', name: 'a' }) ?? '';
    const second = addReferenceImage({ key: 'b', name: 'b' }) ?? '';
    expect(removeReferenceImage(first)).toBe(true);
    expect(removeReferenceImage('nope')).toBe(false);
    expect(updateReferenceImage('nope', { x: 1 })).toBe(false);
    expect(currentReferences().map((each) => each.id)).toEqual([second]);
  });
});
