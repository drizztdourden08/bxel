/* @layer renderer-app @kind component */
import { Icon, Image } from '@drizztdourden08/tessera';
import { KIND_ICON } from '../../../asset-list/asset-list.constants';
import { thumbImage } from '../../../project-browser/thumb-image';
import type { BrowserEntry } from '../../../project-browser/project-browser.type';
import { useBrowserContext } from '../behavior/useBrowserContext';
import { FolderThumb } from './FolderThumb';
import { ThumbCanvas } from './ThumbCanvas';

const FileThumb = ({ entry }: { readonly entry: BrowserEntry }) => {
  const { model } = useBrowserContext();
  if (entry.kind === 'folder') return <FolderThumb entry={entry} />;
  const image = model.artwork && entry.key ? thumbImage(model.artwork, entry.key) : null;
  if (image) return <ThumbCanvas image={image} label={entry.row.name} />;
  if (entry.row.preview) return <Image className="browser-thumb__canvas" src={entry.row.preview} alt={entry.row.name} pixelated />;
  return <Icon className="browser-thumb__icon" name={KIND_ICON[entry.row.kind]} />;
};

export { FileThumb };
