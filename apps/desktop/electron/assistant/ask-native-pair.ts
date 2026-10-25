/* @layer electron-main @kind logic */
import type { ProgramMode } from '@bxel/mcp';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { MAIN_TEXT, NATIVE_PAIR_TEXT } from './assistant.constants';

const askNativePair = async (ctx: Pick<MainContext, 'dialogs'>, program: string | null): Promise<ProgramMode> => {
  const message = NATIVE_PAIR_TEXT.message(program ?? MAIN_TEXT.unnamed);
  const reading = await ctx.dialogs.confirm({
    title: NATIVE_PAIR_TEXT.title,
    message,
    detail: NATIVE_PAIR_TEXT.readDetail,
    confirmLabel: NATIVE_PAIR_TEXT.readAllow,
    cancelLabel: NATIVE_PAIR_TEXT.readRefuse,
    showOnAutomation: true,
  });
  if (!reading) return 'blocked';
  const keeping = await ctx.dialogs.confirm({
    title: NATIVE_PAIR_TEXT.title,
    message,
    detail: NATIVE_PAIR_TEXT.editDetail,
    confirmLabel: NATIVE_PAIR_TEXT.editKeep,
    cancelLabel: NATIVE_PAIR_TEXT.editAllow,
    showOnAutomation: true,
  });
  return keeping ? 'read' : 'edit';
};

export { askNativePair };
