import React from 'react';
import { hydrate, render } from 'react-dom';

import './index.scss';
import App from './components/App/App';

window.snapSaveState = () => {
  // Remove all elements created by OpenLayers. This is DOM not managed by React, so
  // React cannot hydrate it.
  document
    .querySelectorAll('[class^="ol"],canvas')
    .forEach(element => element.parentNode.removeChild(element));
};

const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
