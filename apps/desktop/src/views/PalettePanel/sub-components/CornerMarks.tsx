/* @layer renderer-app @kind component */
import { Text } from '@drizztdourden08/tessera';
import type { CornerMarksProps } from '../PalettePanel.type';

const CornerMarks = ({ marks }: CornerMarksProps) => (
  <>
    {marks.map((mark) => (
      <Text key={mark} variant="caption" aria-hidden className={`swatch-mark swatch-mark--${mark}`}>
        {mark}
      </Text>
    ))}
  </>
);

export { CornerMarks };
