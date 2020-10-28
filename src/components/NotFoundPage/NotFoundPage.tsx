import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import STYLES from './NotFoundPage.module.scss';

export const NotFoundPage: React.FunctionComponent = () => (
  <div className={STYLES.NotFoundPage}>
    <Helmet>
      <title>404 Not Found</title>
    </Helmet>
    <h1>Not Found</h1>
    <Link to="/">Go Home &raquo;</Link>
  </div>
);
