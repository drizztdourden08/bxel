/* @layer renderer-app @kind entry */
import '@drizztdourden08/tessera/tokens.css';
import '../.brock/palette.css';
import './theme.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrockApp } from '@drizztdourden08/brock-react';
import { rendererModules } from '../.brock/modules.renderer';
import { rendererBootTasks } from '../.brock/boot.renderer';
import { screenTree } from '../.brock/screens';
import { appWidgetLayout, appWidgets } from '../.brock/widgets';
import { appWidgetKits } from '../.brock/widget-kits';
import { appReview } from '../.brock/review';
import { appTitleBar } from '../.brock/title-bar';
import { appTours } from '../.brock/tours';
import { FILE_COMMANDS } from './files/file-commands.constants';
import { useFileMenu } from './hooks/useFileMenu';
import { SETTINGS } from './main.constants';
import { product } from './product';
import { closeGuard } from './recovery/close-guard';
import type { AppSettings } from './settings.type';

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root element');

const App = () => {
  const menu = useFileMenu();
  return (
    <BrockApp<AppSettings>
      product={product}
      settings={SETTINGS}
      screenTree={screenTree}
      modules={rendererModules}
      bootTasks={rendererBootTasks}
      widgets={appWidgets}
      widgetLayout={appWidgetLayout}
      widgetKits={appWidgetKits}
      review={appReview}
      titleBar={appTitleBar}
      tours={appTours}
      commands={FILE_COMMANDS}
      menu={menu}
      beforeQuit={closeGuard}
    />
  );
};

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
