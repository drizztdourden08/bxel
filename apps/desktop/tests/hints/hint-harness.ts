/* @layer renderer-app @kind test */
import * as React from 'react';
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { renderToString } from 'react-dom/server';
import type { HintSpec } from '../../src/views/ActionHint';
import { HintBody } from '../../src/views/ActionHint/sub-components/HintBody';

Object.assign(globalThis, { React });

const render = (element: ReactElement): string => renderToString(element);

const renderHint = (hint: HintSpec): string => render(createElement(HintBody, { hint }));

export { render, renderHint };
