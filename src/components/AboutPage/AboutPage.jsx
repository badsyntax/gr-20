import React, { Fragment } from 'react'
import { IoMdArrowRoundForward } from 'react-icons/io'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import STYLES from './AboutPage.module.scss'

import cover from '../IndexPage/cover.jpg'

const AboutPage = props => (
  <Fragment>
    <Helmet>
      <title>GR-20 - About</title>
    </Helmet>
    <div
      className={STYLES.AboutPage__cover}
      style={{ backgroundImage: `url("${cover}")` }}
    >
      <a href="https://github.com/badsyntax/gr-20">
        <img
          style={{ position: 'absolute', top: 0, left: 0 }}
          src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"
          alt="Fork me on GitHub"
        />
      </a>
      <div className={STYLES['AboutPage__cover-overlay']}>
        <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <header className="masthead mb-auto" />

          <main role="main" className="inner cover">
            <h1 className="cover-heading">GR-20 - About</h1>
            <br />
            <p className="lead" style={{ textShadow: '2px 2px 1px #000' }}>
              This project uses open data from different platforms to provide
              useful information on the GR-20 route. It uses OpenLayers to build
              the map, various open tile servers, and open GPX routes from
              different sources.
              <br />
              <br />
              The source code for this project can be found{' '}
              <a href="https://github.com/badsyntax/gr-20">on GitHub</a>.
            </p>
            <br />
            <p className="lead">
              <Link to="/" className="btn btn-lg btn-primary">
                Home <IoMdArrowRoundForward />
              </Link>{' '}
              <Link to="/map/" className="btn btn-lg btn-primary">
                View Route <IoMdArrowRoundForward />
              </Link>{' '}
              <Link to="/kit/" className="btn btn-lg btn-primary">
                View Kit <IoMdArrowRoundForward />
              </Link>
            </p>
          </main>

          <footer className="mastfoot mt-auto">
            <div className="inner">
              <p>
                Cover template for{' '}
                <a href="https://getbootstrap.com/">Bootstrap</a>, by{' '}
                <a href="https://twitter.com/mdo">@mdo</a>.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </Fragment>
)
export default AboutPage
