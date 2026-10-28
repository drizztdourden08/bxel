/* @layer tests @kind test */
import { documentCommands } from '@bxel/document';
import {
  BUNDLE_IDS,
  BUNDLES,
  bundleOfStep,
  isProtectedSettingKey,
  PRESETS,
  ROUTED_BUNDLES,
  TOOL_CATALOGUE,
  TOOL_NAME,
} from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

describe('the tool catalogue', () => {
  it('places every tool in a known bundle, once', () => {
    expect(Object.keys(TOOL_CATALOGUE).sort()).toEqual(Object.values(TOOL_NAME).sort());
    for (const entry of Object.values(TOOL_CATALOGUE)) expect(BUNDLE_IDS).toContain(entry.bundle);
  });

  it('gives a mixed tool a write test and no other tool one', () => {
    for (const [name, entry] of Object.entries(TOOL_CATALOGUE)) {
      expect(typeof entry.writes === 'function', name).toBe(entry.kind === 'mixed');
    }
  });

  it('tests the writing inputs of the mixed tools', () => {
    expect(TOOL_CATALOGUE.set_view.writes?.({ zoom: 'fit', toggles: { grid: true } })).toBe(false);
    expect(TOOL_CATALOGUE.set_view.writes?.({ zoom: 'fit', selection: { shape: { kind: 'all' } } })).toBe(true);
    for (const field of ['select', 'tool', 'colours', 'symmetry', 'dialog']) expect(TOOL_CATALOGUE.set_view.writes?.({ [field]: {} }), field).toBe(true);
    expect(TOOL_CATALOGUE.close_document.writes?.({ discard: true })).toBe(true);
    expect(TOOL_CATALOGUE.close_document.writes?.({ discard: false })).toBe(false);
    expect(TOOL_CATALOGUE.stop_bxel.writes?.({ unsaved: 'discard' })).toBe(true);
    expect(TOOL_CATALOGUE.stop_bxel.writes?.({ unsaved: 'recover' })).toBe(false);
    expect(TOOL_CATALOGUE.stop_bxel.writes?.(null)).toBe(false);
  });

  it('marks the two step tools as routed', () => {
    const routed = Object.entries(TOOL_CATALOGUE).filter(([, entry]) => entry.routed === 'steps');
    expect(routed.map(([name]) => name).sort()).toEqual(['apply_edits', 'preview_edits']);
  });

  it('routes run_command and keeps the restart behind its permission', () => {
    expect(TOOL_CATALOGUE.run_command.routed).toBe('command');
    expect(TOOL_CATALOGUE.restart_bxel.special).toBe('mayRestart');
  });

  it('keeps the writing tools to those that edit documents, files, layout and settings, and the restart', () => {
    const writing = Object.entries(TOOL_CATALOGUE).filter(([, entry]) => entry.kind === 'write');
    expect(writing.map(([name]) => name).sort()).toEqual(['apply_edits', 'create_document', 'export_document', 'restart_bxel', 'save_document', 'set_layout', 'set_setting', 'split_legacy_file', 'undo']);
  });

  it('lists eleven bundles and flags the five that hold document writes', () => {
    expect(BUNDLES).toHaveLength(11);
    expect(BUNDLES.filter((bundle) => bundle.document).map((bundle) => bundle.id)).toEqual([
      'edit_pixels',
      'animation',
      'sheets_sprites',
      'tilemaps',
      'files_saving',
    ]);
  });
});

describe('the step prefixes', () => {
  it('sends a step to the bundle of its first name part', () => {
    expect(bundleOfStep('pixels.patch')).toBe('edit_pixels');
    expect(bundleOfStep('animation.tag.add')).toBe('animation');
    expect(bundleOfStep('sheet.animation.add')).toBe('sheets_sprites');
    expect(bundleOfStep('sprite.flip')).toBe('sheets_sprites');
    expect(bundleOfStep('tile.animation')).toBe('tilemaps');
    expect(bundleOfStep('map.paint')).toBe('tilemaps');
  });

  it('knows nothing of an unknown or malformed step', () => {
    expect(bundleOfStep('effects.blur')).toBeNull();
    expect(bundleOfStep('toString')).toBeNull();
    expect(bundleOfStep(undefined)).toBeNull();
  });

  it('covers every document command', () => {
    for (const command of documentCommands) {
      const bundle = bundleOfStep(command.name);
      expect(bundle, command.name).not.toBeNull();
      expect(ROUTED_BUNDLES).toContain(bundle);
    }
  });
});

describe('the presets', () => {
  it('sets every bundle in each preset and leaves the special permission off', () => {
    for (const preset of Object.values(PRESETS)) {
      expect(Object.keys(preset.grant.bundles).sort()).toEqual([...BUNDLE_IDS].sort());
      expect(preset.grant.special.mayRestart).toBe(false);
      expect(preset.grant.blocked).toBe(false);
    }
  });

  it('puts Read only at Read, Edit documents at Edit for documents and Full control at Edit for the rest', () => {
    expect(Object.values(PRESETS.read_only.grant.bundles).every((level) => level === 'read')).toBe(true);
    const documents = PRESETS.edit_documents.grant.bundles;
    expect(documents).toMatchObject({ edit_pixels: 'edit', animation: 'edit', sheets_sprites: 'edit', tilemaps: 'edit', files_saving: 'edit' });
    expect(documents).toMatchObject({ app_control: 'read', layout: 'read', settings: 'read', read_documents: 'read' });
    expect(PRESETS.full_control.grant.bundles).toMatchObject({ app_control: 'edit', layout: 'edit', settings: 'edit', files_saving: 'edit' });
  });
});

describe('settings keys no program may write', () => {
  it('protects the assistant keys and the keymap, in any case', () => {
    for (const key of ['assistantAccess', 'assistantPrograms', 'AssistantLevel', 'keymap', ' keymap']) expect(isProtectedSettingKey(key), key).toBe(true);
    for (const key of ['theme', 'gridSize', 'canvasZoom']) expect(isProtectedSettingKey(key), key).toBe(false);
  });
});
