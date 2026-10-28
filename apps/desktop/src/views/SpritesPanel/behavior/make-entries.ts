/* @layer renderer-app @kind logic */
import type { ContextMenuEntry } from '@drizztdourden08/brock-react';
import { unless } from '../../../context-menu/unless';
import { COMPOSE_TEXT } from '../../../sheet-manager/compose-text.constants';
import type { CurrentManager } from '../../../sheet-manager/manager.type';
import { MANAGER_TEXT } from '../../../sheet-manager/manager-text.constants';
import { tilesetBlocker } from '../../../sheet-manager/make-tileset';

const makeEntries = ({ ids, facts }: Pick<CurrentManager, 'ids' | 'facts'>): ContextMenuEntry => {
  const picked = new Set(ids);
  const sprites = facts.filter((fact) => picked.has(fact.sprite.id)).map((fact) => fact.sprite);
  const blocker = tilesetBlocker(sprites);
  return {
    label: MANAGER_TEXT.makeGroup,
    items: [
      { command: 'sprite.make_animation', label: MANAGER_TEXT.animationFrom, ...unless(ids.length > 0, COMPOSE_TEXT.needOne) },
      { command: 'sprite.cut_strip', label: COMPOSE_TEXT.strip, ...unless(ids.length === 1, COMPOSE_TEXT.needStrip) },
      { command: 'sprite.slice', label: COMPOSE_TEXT.slice, ...unless(ids.length > 0, COMPOSE_TEXT.needOne) },
      { command: 'sprite.make_tileset', label: MANAGER_TEXT.tilesetFrom, ...unless(blocker === null, blocker ?? '') },
    ],
  };
};

export { makeEntries };
