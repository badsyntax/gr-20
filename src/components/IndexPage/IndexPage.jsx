import React, { Fragment } from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import STYLES from "./IndexPage.module.scss";

import cover from "./cover.jpg";

const IndexPage = props => (
  <Fragment>
    <Helmet>
      <title>GR-20</title>
    </Helmet>
    <div
      className={STYLES.IndexPage__cover}
      style={{ backgroundImage: `url("${cover}")` }}
    >
      <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
        <header className="masthead mb-auto" />

        <main role="main" className="inner cover">
          <h1 className="cover-heading">GR-20</h1>
          <p className="lead" style={{ textShadow: "2px 2px 1px #000" }}>
            The GR 20 is a GR footpath that crosses the Mediterranean island of
            Corsica running approximately north-south, described by the outdoor
            writer Paddy Dillon as "one of the top trails in the world".
          </p>
          <p className="lead">
            <Link to="/map/" className="btn btn-lg btn-primary">
              View the Route <IoMdArrowRoundForward />
            </Link>{" "}
            <Link to="/kit/" className="btn btn-lg btn-primary">
              View the Kit <IoMdArrowRoundForward />
            </Link>
          </p>
        </main>

        <footer className="mastfoot mt-auto">
          <div className="inner">
            <p>
              Cover template for{" "}
              <a href="https://getbootstrap.com/">Bootstrap</a>, by{" "}
              <a href="https://twitter.com/mdo">@mdo</a>.
            </p>
          </div>
        </footer>
      </div>
    </div>
  </Fragment>
);
export default IndexPage;
