/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { askNativePair } from '../../electron/assistant/ask-native-pair';
import { NATIVE_PAIR_TEXT } from '../../electron/assistant/assistant.constants';

const contextAnswering = (answers: readonly boolean[]) => {
  const confirm = vi.fn();
  for (const answer of answers) confirm.mockResolvedValueOnce(answer);
  return { confirm, ctx: { dialogs: { confirm } } };
};

describe('the native question of a headless Bxel', () => {
  it('asks about read only first, so the default answer is read only', async () => {
    const { ctx, confirm } = contextAnswering([true, true]);
    expect(await askNativePair(ctx, 'Check')).toBe('read');
    expect(confirm.mock.calls[0]?.[0]).toMatchObject({ confirmLabel: NATIVE_PAIR_TEXT.readAllow, cancelLabel: NATIVE_PAIR_TEXT.readRefuse });
  });

  it('answers blocked when read only is refused, after one dialog', async () => {
    const { ctx, confirm } = contextAnswering([false]);
    expect(await askNativePair(ctx, null)).toBe('blocked');
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it('offers editing only after read only, with keeping read only as the default button', async () => {
    const { ctx, confirm } = contextAnswering([true, false]);
    expect(await askNativePair(ctx, 'Check')).toBe('edit');
    expect(confirm).toHaveBeenCalledTimes(2);
    expect(confirm.mock.calls[1]?.[0]).toMatchObject({ confirmLabel: NATIVE_PAIR_TEXT.editKeep, cancelLabel: NATIVE_PAIR_TEXT.editAllow });
  });

  it('shows the dialogs on an automation launch, which is how a headless Bxel starts', async () => {
    const { ctx, confirm } = contextAnswering([true, true]);
    await askNativePair(ctx, 'Check');
    for (const [options] of confirm.mock.calls) expect(options).toMatchObject({ showOnAutomation: true });
  });
});
