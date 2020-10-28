import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <HelmetProvider>
      <App />
    </HelmetProvider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
