/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { askNativePair } from '../../electron/assistant/ask-native-pair';
import { NATIVE_PAIR_TEXT } from '../../electron/assistant/assistant.constants';

const contextPicking = (id: string) => {
  const choose = vi.fn().mockResolvedValue(id);
  return { choose, ctx: { dialogs: { confirm: vi.fn(), choose } } };
};

describe('the native question of a headless Bxel', () => {
  it('asks once, with read only as the button for Enter, for Esc and for closing the box', async () => {
    const { ctx, choose } = contextPicking('read');
    expect(await askNativePair(ctx, 'Check')).toBe('read');
    expect(choose).toHaveBeenCalledTimes(1);
    expect(choose.mock.calls[0]?.[0]).toMatchObject({ defaultId: 'read', cancelId: 'read' });
  });

  it('gives editing only when the owner picks it', async () => {
    expect(await askNativePair(contextPicking('edit').ctx, 'Check')).toBe('edit');
    expect(await askNativePair(contextPicking('read').ctx, 'Check')).toBe('read');
  });

  it('answers blocked when the owner denies', async () => {
    expect(await askNativePair(contextPicking('blocked').ctx, null)).toBe('blocked');
  });

  it('turns an answer it does not know into read only', async () => {
    expect(await askNativePair(contextPicking('other').ctx, 'Check')).toBe('read');
  });

  it('offers read only, editing and deny by name, and never uses confirm', async () => {
    const { ctx, choose } = contextPicking('read');
    await askNativePair(ctx, 'Check');
    expect(choose.mock.calls[0]?.[0].choices).toEqual([
      { id: 'read', label: NATIVE_PAIR_TEXT.readLabel },
      { id: 'edit', label: NATIVE_PAIR_TEXT.editLabel },
      { id: 'blocked', label: NATIVE_PAIR_TEXT.denyLabel },
    ]);
    expect(ctx.dialogs.confirm).not.toHaveBeenCalled();
  });

  it('shows the dialog on an automation launch, which is how a headless Bxel starts', async () => {
    const { ctx, choose } = contextPicking('read');
    await askNativePair(ctx, 'Check');
    expect(choose.mock.calls[0]?.[0]).toMatchObject({ showOnAutomation: true });
  });
});
