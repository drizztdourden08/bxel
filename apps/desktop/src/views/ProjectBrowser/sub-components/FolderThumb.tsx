/* @layer renderer-app @kind component */
import { Box, Icon } from '@drizztdourden08/tessera';
import { mosaicOf } from '../../../project-browser/mosaic-of';
import type { FolderEntry } from '../../../project-browser/project-browser.type';
import { thumbImage } from '../../../project-browser/thumb-image';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { ThumbCanvas } from './ThumbCanvas';

const FolderThumb = ({ entry }: { readonly entry: FolderEntry }) => {
  const { model } = useBrowserContext();
  const artwork = model.artwork;
  const cells = artwork ? mosaicOf(model.everyFile, entry.path) : [];
  if (cells.length === 0 || !artwork) return <Icon className="browser-thumb__icon" name={entry.linked ? 'link' : 'folder'} />;
  return (
    <Box className="browser-mosaic">
      {cells.map((cell) => {
        const image = cell.key ? thumbImage(artwork, cell.key) : null;
        return (
          <Box key={cell.id} className="browser-mosaic__cell">
            {image ? <ThumbCanvas image={image} label={cell.row.name} /> : <Icon name="file" size={14} />}
          </Box>
        );
      })}
    </Box>
  );
};

export { FolderThumb };
