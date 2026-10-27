/* @layer tests @kind test */
import { bundleOfStep, checkGrant, PRESETS } from '@bxel/mcp';
import { describe, expect, it } from 'vitest';
import { APP_COMMANDS } from '../../src/documents/document-host.constants';

describe('every step the app registers belongs to a bundle', () => {
  it('places each document, palette and raster command', () => {
    const unplaced = APP_COMMANDS.map((command) => command.name).filter((name) => bundleOfStep(name) === null);
    expect(unplaced).toEqual([]);
  });

  it('refuses a Tilemaps step at Read and applies the others, for the real command names', () => {
    const grant = { ...PRESETS.full_control.grant, bundles: { ...PRESETS.full_control.grant.bundles, tilemaps: 'read' as const } };
    for (const { name } of APP_COMMANDS) {
      const failure = checkGrant('apply_edits', { steps: [{ name }] }, grant);
      const tilemaps = bundleOfStep(name) === 'tilemaps';
      expect(failure === null, name).toBe(!tilemaps);
    }
  });
});
