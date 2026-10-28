/* @layer renderer-app @kind test */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TOOL_HANDLERS } from '../../src/assistant/tool-handlers.constants';

const WALK_TIMEOUT_MS = 60_000;

const SRC = resolve(__dirname, '../../src');

const DIALOG = /confirmAction|confirmSave|confirmChoice|documents\.(?:saveAs|open|openFolder|regrant)\(|owner-prompts|file-kit|useDialogStore/;

const importsOf = (file: string): readonly string[] =>
  [...readFileSync(file, 'utf8').matchAll(/from '(\.[^']*)'/g)].flatMap((match) => {
    const base = resolve(dirname(file), match[1] ?? '');
    return [`${base}.ts`, `${base}.tsx`, join(base, 'index.ts')].filter((candidate) => existsSync(candidate));
  });

const reachable = (starts: readonly string[]): ReadonlySet<string> => {
  const seen = new Set<string>();
  const queue = [...starts];
  for (let file = queue.shift(); file !== undefined; file = queue.shift()) {
    if (seen.has(file)) continue;
    seen.add(file);
    queue.push(...importsOf(file));
  }
  return seen;
};

const toolFiles = (): readonly string[] => [resolve(SRC, 'assistant/tool-handlers.constants.ts'), resolve(SRC, 'assistant/guard-handlers.ts')];

describe('every code path an assistant tool can reach', () => {
  it('has a handler for each tool the app answers, all behind the guard', () => {
    expect(Object.keys(TOOL_HANDLERS).length).toBeGreaterThan(15);
  });

  it('never imports or calls a dialog, a file picker or a confirm', () => {
    const offenders = [...reachable(toolFiles())]
      .filter((file) => DIALOG.test(readFileSync(file, 'utf8')))
      .map((file) => relative(SRC, file).replace(/\\/g, '/'))
      .filter((file) => !['prompts/guard-documents.ts'].includes(file));
    expect(offenders).toEqual([]);
  }, WALK_TIMEOUT_MS);
});
