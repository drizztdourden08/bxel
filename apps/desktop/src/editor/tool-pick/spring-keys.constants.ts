/* @layer renderer-app @kind constants */
import type { ToolId } from '../tool.type';

const SPRING_KEYS: Readonly<Record<string, ToolId>> = { ' ': 'hand', Alt: 'picker' };

const ALT_PICK_TOOLS: readonly ToolId[] = ['pencil', 'eraser', 'spray', 'shade', 'fill', 'gradient', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'];

const SPRING_PASSIVE_KEYS: readonly string[] = ['Control', 'Meta'];

const SPRING_KEY_NOTICE = (label: string): string => `${label} while you hold the key`;

const SPRING_END_NOTICE = 'Borrowed tool ended';

const SPRING_DIALOG_SELECTOR = '[role="dialog"][aria-modal="true"], [role="alertdialog"], dialog[open]';

export { ALT_PICK_TOOLS, SPRING_DIALOG_SELECTOR, SPRING_END_NOTICE, SPRING_KEY_NOTICE, SPRING_KEYS, SPRING_PASSIVE_KEYS };
