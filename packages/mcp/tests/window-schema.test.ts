/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import { buildTools, parseToolInput } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

const tools = buildTools(documentCommands);
const setView = tools.find((candidate) => candidate.name === 'set_view');

const accepts = (window: unknown): boolean => (setView ? parseToolInput(setView, { window }).ok : false);

describe('set_view window', { tags: ['standard'] }, () => {
  it('accepts each window with an optional page', () => {
    expect(accepts({ open: 'project' })).toBe(true);
    expect(accepts({ open: 'project', page: 'health' })).toBe(true);
    expect(accepts({ open: 'options', page: 'general' })).toBe(true);
    expect(accepts({ open: 'properties', pin: false })).toBe(true);
  });

  it('refuses an unknown window and unknown fields', () => {
    expect(accepts({ open: 'canvas' })).toBe(false);
    expect(accepts({ open: 'project', colour: 'red' })).toBe(false);
    expect(accepts({})).toBe(false);
  });
});
