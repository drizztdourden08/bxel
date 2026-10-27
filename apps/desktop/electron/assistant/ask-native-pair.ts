/* @layer electron-main @kind logic */
import type { PairChoice } from '@bxel/mcp';
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import { MAIN_TEXT, NATIVE_PAIR_CHOICES, NATIVE_PAIR_TEXT } from './assistant.constants';

const askNativePair = async (ctx: Pick<MainContext, 'dialogs'>, program: string | null): Promise<PairChoice> => {
  const picked = await ctx.dialogs.choose({
    title: NATIVE_PAIR_TEXT.title,
    message: NATIVE_PAIR_TEXT.message(program ?? MAIN_TEXT.unnamed),
    detail: NATIVE_PAIR_TEXT.detail,
    choices: NATIVE_PAIR_CHOICES,
    defaultId: 'read',
    cancelId: 'read',
    showOnAutomation: true,
  });
  return picked === 'edit' || picked === 'full' || picked === 'blocked' ? picked : 'read';
};

export { askNativePair };
