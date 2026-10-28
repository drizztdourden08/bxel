/* @layer renderer-app @kind component */
import { Box, Canvas, Icon, Image } from '@drizztdourden08/tessera';
import { useEffect, useRef } from 'react';
import { KIND_ICON } from '../../../asset-list/asset-list.constants';
import { thumbImage } from '../../../project-browser/thumb-image';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useBrowserContext } from '../behavior/browser-context';

const ThumbCanvas = ({ image, label }: { readonly image: { readonly data: Uint8ClampedArray; readonly width: number; readonly height: number }; readonly label: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = ref.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    element.width = image.width;
    element.height = image.height;
    context.putImageData(new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), 0, 0);
  }, [image]);
  return <Canvas ref={ref} className="browser-thumb__canvas" role="img" aria-label={label} />;
};

/** The picture of one entry: its pixels for every Bxel kind, the image for a picture, an icon for the rest. */
const FileThumb = ({ entry }: { readonly entry: BrowserEntry }) => {
  const { model } = useBrowserContext();
  if (entry.kind === 'folder') return <Icon className="browser-thumb__icon" name={entry.linked ? 'link' : 'folder'} size="lg" />;
  const image = model.artwork && entry.key ? thumbImage(model.artwork, entry.key) : null;
  if (image) return <ThumbCanvas image={image} label={entry.row.name} />;
  if (entry.row.preview) return <Image className="browser-thumb__canvas" src={entry.row.preview} alt={entry.row.name} pixelated />;
  return <Icon className="browser-thumb__icon" name={KIND_ICON[entry.row.kind]} size="lg" />;
};

const ThumbBox = ({ entry }: { readonly entry: BrowserEntry }) => (
  <Box className="browser-thumb">
    <FileThumb entry={entry} />
  </Box>
);

export { FileThumb, ThumbBox };
