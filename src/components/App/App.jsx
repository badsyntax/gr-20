import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MapPage from "../MapPage/MapPage";
import IndexPage from "../IndexPage/IndexPage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import "./App.css";

const App = props => (
  <div className="App">
    <Router basename={process.env.PUBLIC_URL}>
      <Switch>
        <Route path="/" exact component={IndexPage} />
        <Route path="/map" exact component={MapPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  </div>
);

export default App;
