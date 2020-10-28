import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AboutPage } from '../AboutPage/AboutPage';
import { IndexPage } from '../IndexPage/IndexPage';
import { MapPage } from '../MapPage/MapPage';
import { NotFoundPage } from '../NotFoundPage/NotFoundPage';
import STYLES from './App.module.scss';

const App: React.FunctionComponent = () => (
  <div className={STYLES.App}>
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
