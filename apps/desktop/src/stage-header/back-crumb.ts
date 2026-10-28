/* @layer renderer-app @kind logic */
import { HEADER_TEXT } from './stage-header.constants';
import type { Crumb, HeaderActions } from './stage-header.type';

const backCrumb = (actions: HeaderActions): Crumb => ({ id: 'back', label: HEADER_TEXT.back, icon: 'arrow-left', title: HEADER_TEXT.backTitle, run: actions.back });

export { backCrumb };
