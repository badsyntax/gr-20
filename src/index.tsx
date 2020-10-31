import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { store } from './store';
import { theme } from './theme/theme';
import './index.scss';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
