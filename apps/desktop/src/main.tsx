/* @layer renderer-app @kind entry */
import '@drizztdourden08/tessera/tokens.css';
import '@drizztdourden08/tessera/visually-hidden.css';
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
import { appStartupPrompts } from '../.brock/startup';
import { APP_COMMANDS } from './keymap/app-commands.constants';
import { useAppMenu } from './hooks/useAppMenu';
import { SETTINGS } from './main.constants';
import { product } from './product';
import { closeGuard } from './recovery/close-guard';
import type { AppSettings } from './settings.type';

const root = document.getElementById('root');
if (!root) throw new Error('index.html has no #root element');

const App = () => {
  const menu = useAppMenu();
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
      commands={APP_COMMANDS}
      menu={menu}
      onBeforeQuit={closeGuard}
      startupPrompts={appStartupPrompts}
    />
  );
};

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
