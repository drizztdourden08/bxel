/* @layer renderer-app @kind component */
import { DropdownMenu } from '@drizztdourden08/tessera';
import { ADD_TEXT } from '../../../add-frames/add-frames.constants';
import { useAddFramesStore } from '../../../stores/useAddFramesStore';
import { addFrame } from '../../../timeline/add-frame';
import { duplicateFrames } from '../../../timeline/duplicate-frames';
import type { MenuProps } from '../TimelinePanel.type';

const AddFramesMenu = ({ disabled }: MenuProps) => {
  const show = useAddFramesStore((state) => state.show);
  const items = [
    { id: 'blank', label: ADD_TEXT.blank, onSelect: addFrame },
    { id: 'duplicate', label: ADD_TEXT.duplicate, onSelect: duplicateFrames },
    { id: 'sprites', label: ADD_TEXT.fromSprites, onSelect: () => show('sprites') },
    { id: 'strip', label: ADD_TEXT.fromStrip, onSelect: () => show('strip') },
    { id: 'sheet', label: ADD_TEXT.fromSheet, onSelect: () => show('sheet') },
  ].map((item) => ({ ...item, disabled }));
  return <DropdownMenu size="sm" label={ADD_TEXT.menu} trigger={{ label: ADD_TEXT.menu }} groups={[{ id: 'add', items }]} />;
};

export { AddFramesMenu };
