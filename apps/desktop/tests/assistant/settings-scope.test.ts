/* @layer renderer-app @kind test */
import type { CatalogScreen } from '@drizztdourden08/brock-react';
import { describe, expect, it } from 'vitest';
import { settingsScope } from '../../src/assistant/tools/settings-scope';

const screen = (group: string): CatalogScreen => ({ group }) as CatalogScreen;

describe('the scope of a settings page', () => {
  it('reads Properties as the asset scope, Project as the project scope and Options as the app scope', () => {
    expect(settingsScope(screen('Properties'))).toBe('asset');
    expect(settingsScope(screen('Project settings'))).toBe('project');
    expect(settingsScope(screen('Project'))).toBe('project');
    expect(settingsScope(screen('Options'))).toBe('app');
  });
});
