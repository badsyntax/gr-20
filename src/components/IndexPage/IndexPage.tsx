import React, { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { IoMdArrowRoundForward } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { BackgroundImage } from '../BackgroundImage/BackgroundImage';
import cover from './cover.jpg';
import STYLES from './IndexPage.module.scss';

export const IndexPage: React.FunctionComponent = () => (
  <Fragment>
    <Helmet>
      <title>GR-20</title>
    </Helmet>
    <BackgroundImage
      imageUrl={cover}
      className={STYLES['IndexPage__background-image']}
    >
      <a href="https://github.com/badsyntax/gr-20">
        <img
          style={{ position: 'absolute', top: 0, left: 0 }}
          src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png"
          alt="Fork me on GitHub"
        />
      </a>
      <main role="main" className={STYLES.IndexPage__main}>
        <h1 className={STYLES.IndexPage__heading}>GR-20</h1>
        <p className={STYLES.IndexPage__summary}>
          The GR 20 is a GR footpath that crosses the Mediterranean island of
          Corsica running approximately north-south, described by the outdoor
          writer Paddy Dillon as "one of the top trails in the world".
        </p>
        <p>
          <Link to="/map/" className="btn btn-lg btn-primary">
            View Routes <IoMdArrowRoundForward />
          </Link>
          {'  '}
          <Link to="/kit/" className="btn btn-lg btn-primary">
            View Kit <IoMdArrowRoundForward />
          </Link>
          {'  '}
          <Link to="/about/" className="btn btn-lg btn-primary">
            About <IoMdArrowRoundForward />
          </Link>
        </p>
      </main>
    </BackgroundImage>
  </Fragment>
);
