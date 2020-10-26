import React from 'react';
import { mergeStyles } from '@fluentui/react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MapPage from '../MapPage/MapPage';
import IndexPage from '../IndexPage/IndexPage';
import AboutPage from '../AboutPage/AboutPage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import './App.css';

const appClassName = mergeStyles({
  height: '100%',
});

const App: React.FunctionComponent = () => (
  <div className={appClassName}>
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/map/" exact component={MapPage} />
        <Route path="/about/" exact component={AboutPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  </div>
);

export default App;
