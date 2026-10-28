/* @layer renderer-app @kind logic */
import { widgets } from '@drizztdourden08/brock-react';
import type { ToolHandler } from '../assistant.type';
import { layoutSnapshot } from './layout-snapshot';
import { reply } from './reply';

const listLayout: ToolHandler = () => reply({ ok: true, ...layoutSnapshot(), presets: widgets.presets() });

export { listLayout };
