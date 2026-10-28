/* @layer renderer-app @kind logic */
import { layerChips } from './layer-chips';
import { layerCrumb } from './layer-crumb';
import { HEADER_TEXT } from './stage-header.constants';
import type { AnimationHeader, Crumb, HeaderActions, HeaderChip, HeaderInput, HeaderModel } from './stage-header.type';

const spriteStep = (animation: AnimationHeader): string => {
  if (animation.spriteName === null) return HEADER_TEXT.noSprite;
  return `${animation.spriteName} (${animation.shared ? HEADER_TEXT.shared : HEADER_TEXT.owned})`;
};

const animationChips = (animation: AnimationHeader): HeaderChip[] => [
  ...(animation.shared ? [{ id: 'shared', text: HEADER_TEXT.sharedHint, tone: 'info' as const }] : []),
  ...animation.notes.map((note, index) => ({ id: `note-${index}`, text: note, tone: 'neutral' as const })),
  ...(animation.clip ? [{ id: 'clip', text: HEADER_TEXT.clip, tone: 'warning' as const }] : []),
];

const animationHeader = (input: HeaderInput, actions: HeaderActions): HeaderModel => {
  const { animation, sprite } = input;
  if (!animation) return { crumbs: [], chips: [], actions: [] };
  const layer = sprite ? layerCrumb(sprite, actions) : null;
  const crumbs: Crumb[] = [
    { id: 'animation', label: animation.name, icon: 'pixel-animation' },
    { id: 'frame', label: HEADER_TEXT.frame(animation.frameAt, animation.frameCount), icon: 'pixel-frame-next' },
    { id: 'sprite', label: spriteStep(animation), icon: 'pixel-sprite', current: layer === null },
    ...(layer ? [layer] : []),
  ];
  return {
    crumbs,
    chips: [...animationChips(animation), ...(sprite ? layerChips(sprite, actions, input.readOnly) : [])],
    actions: animation.shared
      ? [
          { label: HEADER_TEXT.openSprite, run: actions.openSprite },
          { label: HEADER_TEXT.makeCopy, disabled: input.readOnly, run: actions.copyFrame },
        ]
      : [],
  };
};

export { animationHeader };
