/* @layer renderer-app @kind constants */
import type { ToolId } from '../tool.type';

const SPRING_KEYS: Readonly<Record<string, ToolId>> = { ' ': 'hand', Alt: 'picker' };

const ALT_PICK_TOOLS: readonly ToolId[] = ['pencil', 'eraser', 'spray', 'shade', 'fill', 'gradient', 'line', 'curve', 'rect', 'ellipse', 'contour', 'polygon'];

const SPRING_PASSIVE_KEYS: readonly string[] = ['Control', 'Meta'];

const SPRING_KEY_NOTICE = (label: string): string => `${label} while the key is held`;

export { ALT_PICK_TOOLS, SPRING_KEY_NOTICE, SPRING_KEYS, SPRING_PASSIVE_KEYS };
