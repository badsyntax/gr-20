import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import STYLES from './NotFoundPage.module.scss';

const NotFoundPage = (props) => (
  <div className={STYLES.NotFoundPage}>
    <Helmet>
      <title>404 Not Found</title>
    </Helmet>
    <h1>Not Found</h1>
    <Link to="/">Go Home &raquo;</Link>
  </div>
);
export default NotFoundPage;
