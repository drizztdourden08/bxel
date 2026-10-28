/* @layer tests @kind test */
import { PRESETS } from '@bxel/mcp';
import type { Grant, TrustEntry } from '@bxel/mcp';
import * as React from 'react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GRANT_TEXT_UI, TOOL_TEXT } from '../../src/views/AssistantPanel/sub-components/ProgramGrant.constants';
import { withBundleLevel } from '../../src/views/AssistantPanel/behavior/with-bundle-level';
import { withMayRestart } from '../../src/views/AssistantPanel/behavior/with-may-restart';
import { withToolLevel } from '../../src/views/AssistantPanel/behavior/with-tool-level';
import { ProgramGrant } from '../../src/views/AssistantPanel/sub-components/ProgramGrant';

Object.assign(globalThis, { React });

const none = (): void => undefined;

const entry = (grant: Grant): TrustEntry => ({
  key: 'pixel agent',
  displayName: 'Pixel Agent',
  mode: 'edit',
  grant,
  firstApproved: '2026-10-01T00:00:00.000Z',
  lastConnected: '2026-10-27T00:00:00.000Z',
  lastVersion: null,
});

const page = (grant: Grant): string => renderToString(createElement(ProgramGrant, { program: entry(grant), onGrant: none }));

const full = PRESETS.full_control.grant;

describe('the permissions detail of one program', () => {
  it('shows the Tools section with a radio group per bundle and per tool, named for what it governs', () => {
    const html = page(full);
    expect(html).toContain('Tools');
    expect(html).toContain('aria-label="Edit pixels permission"');
    expect(html).toContain('aria-label="Files and saving permission"');
    expect(html).toContain('aria-label="save_document permission"');
    expect(html.match(/role="radiogroup"/g)).toHaveLength(11 + 34);
  });

  it('shows an override badge, a Follow bundle button and the bundle count for an overridden tool', () => {
    const html = page(withToolLevel(withBundleLevel(full, 'files_saving', 'read'), 'create_document', 'edit'));
    expect(html).toContain('aria-label="create_document permission, overrides Files and saving"');
    expect(html).toContain('Follow bundle for create_document');
    expect(html).toContain('aria-label="1 override"');
    expect(html).toContain('4 tools in Files and saving, 1 overridden');
  });

  it('greys impossible options and gives the reason', () => {
    const html = page(full);
    expect(html).toContain('This tool only reads.');
    expect(html).toContain('This tool only writes.');
  });

  it('shows the special permission off with its warning', () => {
    const off = page(full);
    expect(off).toContain(GRANT_TEXT_UI.specialWarning);
    expect(off).toContain('May restart Bxel');
    expect(off).toMatch(/role="switch"[^>]*aria-checked="false"|aria-checked="false"[^>]*role="switch"/);
    const on = page(withMayRestart(full, true));
    expect(on).toMatch(/role="switch"[^>]*aria-checked="true"|aria-checked="true"[^>]*role="switch"/);
  });

  it('shows only the preset and a note for a blocked program', () => {
    const html = page({ ...full, blocked: true });
    expect(html).toContain(GRANT_TEXT_UI.blocked);
    expect(html).not.toContain('role="radiogroup"');
    expect(html).not.toContain('May restart Bxel');
  });
});

describe('the page text', () => {
  it('uses plain prose with no em or en dashes', () => {
    const labels: unknown[] = Object.values(GRANT_TEXT_UI);
    const texts = [...Object.values(TOOL_TEXT), ...labels.filter((value) => typeof value === 'string')] as string[];
    for (const text of texts) expect(text).not.toMatch(/[–—]/);
  });
});
