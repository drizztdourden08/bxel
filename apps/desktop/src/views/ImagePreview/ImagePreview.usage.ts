/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'Shows an RGBA image at its native pixels in a small viewport, with a checkerboard behind transparent pixels, so two images can be compared side by side with the same zoom and pan.',
  useWhen: [
    'The original and a palette-mapped copy of an image are shown beside each other before an import.',
    'A sprite is shown before and after a palette change.',
  ],
  avoidWhen: [
    { case: 'The sprite is being drawn on and the app owns the pixels.', use: 'PixelViewport' },
    { case: 'A picture opens large over the page, with zoom and arrows through a set.', use: 'MediaViewer' },
  ],
  rules: [
    'Pass the image as RGBA bytes with its width and height, and a label for the region.',
    'Pass the same view object to every preview that must move together; the first zoom or pan reaches all of them.',
    'The preview is read only: dragging pans and the wheel zooms.',
  ],
  a11y: [
    'The preview is one Tab stop, an application region named by label.',
    'The arrow keys pan and the zoom level is announced once it settles.',
  ],
  tree: {
    path: ['data', 'a drawing', 'in pixels'],
    rule: 'ImagePreview shows a finished pixel image that the person only looks at and compares.',
  },
  example: `import { ImagePreview } from '../ImagePreview';
import { useSharedView } from '../ImagePreview/behavior/useSharedView';

const Compare = ({ before, after }: { before: ImageData; after: ImageData }) => {
  const view = useSharedView();
  return (
    <>
      <ImagePreview image={before} label="Before" view={view} />
      <ImagePreview image={after} label="After" view={view} />
    </>
  );
};
`,
  propsHash: 'd1ed37428120ae6b',
} satisfies ComponentUsage;

export { usage };
