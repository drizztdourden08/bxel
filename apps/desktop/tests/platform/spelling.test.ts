/* @layer renderer-app @kind test */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../../../../', import.meta.url));

const LITERAL = /(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g;

const PROPER_NOUN = /Game Boy Color/;

const SCAN_TIMEOUT_MS = 60_000;

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
  });

const packageSources = (): string[] =>
  readdirSync(join(ROOT, 'packages')).flatMap((name) => sourceFiles(join(ROOT, 'packages', name, 'src')));

const americanText = (file: string): string[] => {
  const text = readFileSync(file, 'utf8');
  if (!/\bcolors?\b(?!-)/i.test(text)) return [];
  return [...text.matchAll(LITERAL)]
    .map((match) => (match[2] ?? '').replace(/\$\{[^}]*\}/g, '').replace(/`[^`]*`/g, ''))
    .filter((body) => /\s/.test(body) && !PROPER_NOUN.test(body) && /\bcolors?\b(?!-)/i.test(body));
};

describe('the spelling of colour in text the user reads', () => {
  it('is colour in the app', { timeout: SCAN_TIMEOUT_MS }, () => {
    const found = sourceFiles(join(ROOT, 'apps', 'desktop', 'src')).flatMap(americanText);
    expect(found).toEqual([]);
  });

  it('is colour in the packages', { timeout: SCAN_TIMEOUT_MS }, () => {
    expect(packageSources().flatMap(americanText)).toEqual([]);
  });
});
