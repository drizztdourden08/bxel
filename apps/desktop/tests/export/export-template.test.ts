/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { fillTemplate } from '../../src/export/fill-template';
import { planExport } from '../../src/export/plan-export';
import { startSettings } from '../../src/export/start-settings';
import { addFrame, frozenOf, harness, settingsOf } from './export-harness';

const namesOf = (plan: ReturnType<typeof planExport>): string[] => plan.files.map((file) => file.name);

describe('filling a file name template', () => {
  const values = { name: 'caps', sprite: 'hero', frame: '2' };

  it('puts the name, the sprite and the frame in place', () => {
    expect(fillTemplate('{sprite}-{frame}', values)).toBe('hero-2');
    expect(fillTemplate('{name}_{sprite}_{frame}', values)).toBe('caps_hero_2');
  });

  it('drops the separators around a part that is empty', () => {
    expect(fillTemplate('{sprite}-{frame}', { ...values, frame: '' })).toBe('hero');
    expect(fillTemplate('{frame}_{sprite}', { ...values, frame: '' })).toBe('hero');
    expect(fillTemplate('{name}__{sprite}', { ...values, name: '' })).toBe('hero');
  });

  it('keeps the text between the tokens and makes the result safe', () => {
    expect(fillTemplate('art {sprite}', values)).toBe('art hero');
    expect(fillTemplate('{sprite}.png', values)).toBe('hero');
    expect(fillTemplate('{frame}', { ...values, frame: '' })).toBe('');
  });
});

describe('export file names with a project template', () => {
  it('names every frame by the template', () => {
    const h = harness();
    addFrame(h, 80);
    const settings = settingsOf({ kind: 'frames', frames: 'all', pathTemplate: '{sprite}-{frame}' });
    expect(namesOf(planExport({ frozen: frozenOf(h), settings, selectedIds: [] }))).toEqual(['sprite-0.png', 'sprite-1.png']);
  });

  it('uses the typed name for the name part', () => {
    const h = harness();
    const settings = settingsOf({ fileName: 'caps', pathTemplate: '{name}_{sprite}' });
    expect(namesOf(planExport({ frozen: frozenOf(h), settings, selectedIds: [] }))).toEqual(['caps_sprite.png']);
  });

  it('falls back to the usual name when the template fills to nothing', () => {
    const h = harness();
    const settings = settingsOf({ pathTemplate: '{frame}' });
    expect(namesOf(planExport({ frozen: frozenOf(h), settings, selectedIds: [] }))).toEqual(['sprite.png']);
  });

  it('refuses two files that would get the same name', () => {
    const h = harness();
    addFrame(h, 80);
    const settings = settingsOf({ kind: 'frames', frames: 'all', pathTemplate: '{sprite}' });
    expect(planExport({ frozen: frozenOf(h), settings, selectedIds: [] }).problem).toMatch(/Two files would be named/);
  });
});

describe('the export window in a project', () => {
  it('starts on the project scale and template, which win over the remembered ones', () => {
    const last = settingsOf({ scale: 2, pathTemplate: '{name}' });
    const start = startSettings(last, '', { scale: 4, pathTemplate: '{sprite}-{frame}' });
    expect([start.scale, start.pathTemplate]).toEqual([4, '{sprite}-{frame}']);
  });

  it('keeps the remembered scale when the project sets none, and forgets a template from another project', () => {
    const last = settingsOf({ scale: 2, pathTemplate: '{name}' });
    const start = startSettings(last, '', { pathTemplate: undefined });
    expect([start.scale, start.pathTemplate]).toEqual([2, '']);
    expect(startSettings(last, '').pathTemplate).toBe('');
  });
});
