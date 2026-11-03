/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { lockMessage } from '../../src/sheet-manager/lock-message';
import { SHEET_TEXT } from '../../src/sheet-manager/sheet-text.constants';

describe('S2 the sheet lock bar', { tags: ['standard'] }, () => {
  it('says nothing while the file is editable and nobody else is working on it', () => {
    expect(lockMessage(false, null)).toBeNull();
  });

  it('says the file is read only', () => {
    expect(lockMessage(true, null)).toBe(SHEET_TEXT.lock.readOnly);
  });

  it('names what the assistant is doing while it holds the file', () => {
    expect(lockMessage(false, 'Drawing')).toContain('Drawing');
  });

  it('puts read only before the assistant', () => {
    expect(lockMessage(true, 'Drawing')).toBe(SHEET_TEXT.lock.readOnly);
  });
});
