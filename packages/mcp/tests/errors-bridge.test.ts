/* @layer tests @kind test */
import { ERROR_CODE } from '@bxel/document';
import type { CommandError } from '@bxel/document';
import {
  checkHello,
  CONTRACT_VERSION,
  engineFailure,
  FAILURE_SCHEMA,
  MCP_ERROR_CODE,
  MCP_ROUTE,
  mcpFailure,
  mcpOk,
  retryFor,
  TOOL_NAME,
  TOOL_ROUTE,
  toToolResult,
} from '@bxel/mcp';
import { describe, expect, it } from 'vitest';

describe('retry values', () => {
  it.each([
    ['STALE_REVISION', 'after_read'],
    ['DOCUMENT_NOT_FOUND', 'after_read'],
    ['TARGET_NOT_FOUND', 'after_read'],
    ['INVALID_OPTION', 'fix_input'],
    ['INDEX_OUT_OF_RANGE', 'fix_input'],
    ['OUT_OF_BOUNDS', 'fix_input'],
    ['LAYER_LOCKED', 'after_owner'],
    ['READ_ONLY_DOCUMENT', 'after_owner'],
    ['NOTHING_TO_UNDO', 'never'],
    ['UNDO_NOT_OWN', 'never'],
    ['DOCUMENT_BUSY', 'later'],
    ['BXEL_NOT_RUNNING', 'after_start'],
    ['START_NOT_ALLOWED', 'after_owner'],
    ['START_FAILED', 'later'],
    ['STOP_NOT_ALLOWED', 'never'],
    ['UNSAVED_CHANGES', 'fix_input'],
    ['MCP_DISABLED', 'after_owner'],
    ['PAIRING_DENIED', 'after_owner'],
    ['PAIRING_TIMEOUT', 'after_owner'],
    ['SESSION_REVOKED', 'after_owner'],
    ['PROJECT_NOT_FOUND', 'after_read'],
    ['FILE_NOT_FOUND', 'after_read'],
    ['FOLDER_NOT_FOUND', 'after_read'],
    ['PROJECT_NOT_GRANTED', 'after_owner'],
    ['WRITE_NOT_ALLOWED', 'after_owner'],
    ['FILE_NOT_SUPPORTED', 'fix_input'],
    ['FILE_NOT_BXEL', 'never'],
    ['VERSION_TOO_NEW', 'never'],
    ['SESSION_UNKNOWN', 'later'],
    ['READ_ONLY_SESSION', 'after_owner'],
    ['PATH_NOT_ALLOWED', 'fix_input'],
    ['NAME_INVALID', 'fix_input'],
    ['PATH_INVALID', 'fix_input'],
    ['FILE_EXISTS', 'fix_input'],
    ['FILE_IN_USE', 'fix_input'],
    ['NEEDS_FILE_NAME', 'fix_input'],
    ['RESULT_TOO_LARGE', 'fix_input'],
    ['APP_BUSY', 'later'],
    ['HELPER_OUTDATED', 'never'],
    ['BRIDGE_ERROR', 'later'],
    ['SOMETHING_NEW', 'never'],
  ])('%s retries %s', (code, retry) => {
    expect(retryFor(code)).toBe(retry);
  });

  it('gives every engine and MCP code a retry value', () => {
    for (const code of [...Object.values(ERROR_CODE), ...Object.values(MCP_ERROR_CODE)]) {
      expect(['never', 'fix_input', 'after_read', 'after_owner', 'after_start', 'later']).toContain(retryFor(code));
    }
  });
});

describe('failure and ok results', () => {
  it('builds a failure that matches the Failure shape', () => {
    const failure = mcpFailure('PATH_INVALID', 'Bad path.', { path: 'location.path' });
    expect(FAILURE_SCHEMA.safeParse(failure).success).toBe(true);
    expect(failure.error).toMatchObject({ step: null, path: 'location.path', details: [], retry: 'fix_input' });
    expect('currentRevision' in failure.error).toBe(false);
  });

  it('carries the revision and what moved on a stale revision', () => {
    const since = [{ revision: 13, label: 'Pencil', origin: 'ui' as const }];
    const failure = mcpFailure('STALE_REVISION', 'The document moved.', { currentRevision: 13, since });
    expect(FAILURE_SCHEMA.safeParse(failure).success).toBe(true);
    expect(failure.error.currentRevision).toBe(13);
    expect(failure.error.since).toEqual(since);
  });

  it('passes engine codes through unchanged and adds retry', () => {
    const error: CommandError = {
      code: ERROR_CODE.LAYER_LOCKED,
      message: 'Layer is locked.',
      step: 2,
      path: 'targets.layers',
      details: [{ spriteId: 'spr_4k9m2q7x1v8c', layerId: 'lay_4k9m2q7x1v8c', frameId: null, reason: 'locked' } as CommandError['details'][number]],
    };
    const failure = engineFailure(error, { currentRevision: 7 });
    expect(FAILURE_SCHEMA.safeParse(failure).success).toBe(true);
    expect(failure.error).toMatchObject({ code: 'LAYER_LOCKED', message: 'Layer is locked.', step: 2, path: 'targets.layers', retry: 'after_owner', currentRevision: 7 });
    expect(failure.error.details).toHaveLength(1);
  });

  it('marks an ok result', () => {
    expect(mcpOk({ revision: 3 })).toEqual({ ok: true, revision: 3 });
  });

  it('turns results into MCP tool results', () => {
    const ok = toToolResult(mcpOk({ revision: 3 }), 'Revision 3.');
    expect(ok.isError).toBeUndefined();
    expect(ok.content).toEqual([{ type: 'text', text: 'Revision 3.' }]);
    expect(ok.structuredContent).toEqual({ ok: true, revision: 3 });
    const failed = toToolResult(mcpFailure('FILE_EXISTS', 'It exists.'), 'unused');
    expect(failed.isError).toBe(true);
    expect(failed.content[0]?.text).toBe('FILE_EXISTS: It exists. (retry: fix_input)');
    expect(failed.structuredContent).toMatchObject({ ok: false });
  });
});

describe('bridge names', () => {
  it('names every route and ask channel under bxel:mcp', () => {
    for (const route of Object.values(MCP_ROUTE)) expect(route.startsWith('bxel:mcp:')).toBe(true);
    expect(new Set(Object.values(MCP_ROUTE)).size).toBe(Object.values(MCP_ROUTE).length);
  });

  it('has a route for every tool except start_bxel', () => {
    expect(Object.keys(TOOL_ROUTE).sort()).toEqual(Object.values(TOOL_NAME).filter((name) => name !== 'start_bxel').sort());
  });

  it('checks the hello payload and the contract number', () => {
    const hello = { contract: CONTRACT_VERSION, helperVersion: '0.1.0', client: { name: 'pixel-agent', version: '2.4.1' } };
    expect(checkHello(hello).ok).toBe(true);
    const outdated = checkHello({ ...hello, contract: 2 });
    expect(!outdated.ok && outdated.error.code).toBe('HELPER_OUTDATED');
    const broken = checkHello({ ...hello, client: {} });
    expect(!broken.ok && broken.error.code).toBe('INVALID_OPTION');
    expect(checkHello({ ...hello, launchToken: 'x' }).ok).toBe(false);
  });
});
