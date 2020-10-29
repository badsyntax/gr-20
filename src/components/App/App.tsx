import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hideSpinner, showSpinner } from '../../features/spinner';

import STYLES from './App.module.scss';
import { useDispatch } from 'react-redux';
import { Spinner } from '../Spinner/Spinner';

const Index = lazy(() =>
  import(/* webpackChunkName: "index-page" */ '../IndexPage/IndexPage').then(
    ({ IndexPage }) => ({
      default: IndexPage,
    })
  )
);

const Map = lazy(() =>
  import(/* webpackChunkName: "map-page" */ '../MapPage/MapPage').then(
    ({ MapPage }) => ({
      default: MapPage,
    })
  )
);

const About = lazy(() =>
  import(/* webpackChunkName: "about-page" */ '../AboutPage/AboutPage').then(
    ({ AboutPage }) => ({
      default: AboutPage,
    })
  )
);

const NotFound = lazy(() =>
  import(
    /* webpackChunkName: "not-found-page" */ '../NotFoundPage/NotFoundPage'
  ).then(({ NotFoundPage }) => ({
    default: NotFoundPage,
  }))
);

const ShowSpinner: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showSpinner());
    return () => {
      dispatch(hideSpinner());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

const App: React.FunctionComponent = () => (
  <div className={STYLES.App}>
    <Spinner />
    <Router basename={process.env.PUBLIC_URL}>
      <Suspense fallback={<ShowSpinner />}>
        <Switch>
          <Route path="/" exact component={Index} />
          <Route path="/map/" exact component={Map} />
          <Route path="/about/" exact component={About} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Router>
  </div>
);

export default App;
