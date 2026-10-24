/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { askNativePair } from '../../electron/assistant/ask-native-pair';

const contextAnswering = (answers: readonly boolean[]) => {
  const confirm = vi.fn();
  for (const answer of answers) confirm.mockResolvedValueOnce(answer);
  return { confirm, ctx: { dialogs: { confirm } } };
};

describe('the native question of a headless Bxel', () => {
  it('answers edit when the owner allows editing, after one dialog', async () => {
    const { ctx, confirm } = contextAnswering([true]);
    expect(await askNativePair(ctx, 'Check')).toBe('edit');
    expect(confirm).toHaveBeenCalledTimes(1);
  });

  it('asks about read only next and answers read, or blocked when that is refused too', async () => {
    const reading = contextAnswering([false, true]);
    expect(await askNativePair(reading.ctx, 'Check')).toBe('read');
    const refusing = contextAnswering([false, false]);
    expect(await askNativePair(refusing.ctx, null)).toBe('blocked');
  });

  it('shows the dialogs on an automation launch, which is how a headless Bxel starts', async () => {
    const { ctx, confirm } = contextAnswering([false, false]);
    await askNativePair(ctx, 'Check');
    for (const [options] of confirm.mock.calls) expect(options).toMatchObject({ showOnAutomation: true });
  });
});
