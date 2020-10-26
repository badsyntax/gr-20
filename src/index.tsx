import { initializeIcons, mergeStyles } from '@fluentui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import reportWebVitals from './reportWebVitals';
import App from './components/App/App';

initializeIcons(/* optional base url */);

mergeStyles({
  selectors: {
    ':global(body), :global(html), :global(#root)': {
      margin: 0,
      padding: 0,
      height: '100%',
    },
  },
});

function renderApp(): void {
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

renderApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
