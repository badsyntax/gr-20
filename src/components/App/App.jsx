import React, { Fragment } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import MapPage from "../MapPage/MapPage";
import IndexPage from "../IndexPage/IndexPage";
import "./App.css";

const App = props => (
  <div className="App">
    <Router>
      <Fragment>
        <Route path="/" exact component={IndexPage} />
        <Route path="/map" component={MapPage} />
      </Fragment>
    </Router>
  </div>
);

export default App;
