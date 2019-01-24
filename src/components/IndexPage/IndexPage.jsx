import React, { Fragment } from 'react';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import STYLES from './IndexPage.module.scss';

import cover from './cover.jpg';

const IndexPage = props => (
  <Fragment>
    <Helmet>
      <title>GR-20</title>
    </Helmet>
    <div
      className={STYLES.IndexPage__cover}
      style={{ backgroundImage: `url("${cover}")` }}
    >
      <a href="https://github.com/badsyntax/gr-20">
        <img
          style={{ position: 'absolute', top: 0, left: 0 }}
          src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"
          alt="Fork me on GitHub"
        />
      </a>
      <div className={STYLES['IndexPage__cover-overlay']}>
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <header className="masthead mb-auto" />

          <main role="main" className="inner cover">
            <h1 className="cover-heading">GR-20</h1>
            <p className="lead" style={{ textShadow: '2px 2px 1px #000' }}>
              The GR 20 is a GR footpath that crosses the Mediterranean island
              of Corsica running approximately north-south, described by the
              outdoor writer Paddy Dillon as "one of the top trails in the
              world".
            </p>
            <p className="lead">
              <Link to="/map/" className="btn btn-lg btn-primary">
                View Routes <IoMdArrowRoundForward />
              </Link>{' '}
              <Link to="/kit/" className="btn btn-lg btn-primary">
                View Kit <IoMdArrowRoundForward />
              </Link>{' '}
              <Link to="/about/" className="btn btn-lg btn-primary">
                About <IoMdArrowRoundForward />
              </Link>
            </p>
          </main>

          <footer className="mastfoot mt-auto">
            <div className="inner">
              {/* <p>
                Cover photo by <a href="#">Richard Willis</a>
                {/* for{' '} */}
              {/* <a href="https://getbootstrap.com/">Bootstrap</a>, by{' '} */}
              {/* <a href="https://twitter.com/mdo">@mdo</a>. */}
              {/* </p> */}
            </div>
          </footer>
        </div>
      </div>
    </div>
  </Fragment>
);
export default IndexPage;
