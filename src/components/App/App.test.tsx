import React from 'react';
import configureMockStore from 'redux-mock-store';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import App from './App';

const mockStore = configureMockStore();

it('renders without crashing', () => {
  const store = mockStore({
    spinner: {
      isVisible: false,
    },
  });
  const div = document.createElement('div');
  ReactDOM.render(
    <Provider store={store}>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
