import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hideSpinner, showSpinner } from '../../features/spinner';

import { useDispatch } from 'react-redux';
import { Spinner } from '../Spinner/Spinner';
import { useStyles } from './App.styles';
import { Index, About, NotFound, Map } from './Routes';

const ShowSpinner: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(showSpinner());
    return () => {
      dispatch(hideSpinner());
    };
  }, [dispatch]);
  return null;
};

const App: React.FunctionComponent = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
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
};

export default App;
