/* @layer core @kind test */
import { migrate } from '@bxel/document/native';
import type { Migration, MigrationInput } from '@bxel/document/native';
import { describe, expect, it } from 'vitest';

const blobs = new Map<string, Uint8Array>();
const start: MigrationInput = { document: 'v1', blobs };

const step = (from: number, to: number): Migration => ({
  from,
  to,
  up: (input) => ({ document: `${String(input.document)}>v${to}`, blobs: input.blobs }),
});

describe('native migrations', () => {
  it('returns the input untouched when the file is already current', () => {
    expect(migrate(start, 1, [], 1)).toBe(start);
    expect(migrate(start, 1)).toBe(start);
  });

  it('chains the steps from the file version up to the target', () => {
    const result = migrate(start, 1, [step(2, 3), step(1, 2)], 3);
    expect(result?.document).toBe('v1>v2>v3');
    expect(result?.blobs).toBe(blobs);
  });

  it('starts at the file version, not at the first step', () => {
    expect(migrate({ document: 'v2', blobs }, 2, [step(1, 2), step(2, 3)], 3)?.document).toBe('v2>v3');
  });

  it('gives up with null when a step is missing', () => {
    expect(migrate(start, 1, [step(2, 3)], 3)).toBeNull();
  });
});
