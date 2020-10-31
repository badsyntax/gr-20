import { lazy } from 'react';

export const Index = lazy(() =>
  import(/* webpackChunkName: "index-page" */ '../IndexPage/IndexPage').then(
    ({ IndexPage }) => ({
      default: IndexPage,
    })
  )
);

export const Map = lazy(() =>
  import(/* webpackChunkName: "map-page" */ '../MapPage/MapPage').then(
    ({ MapPage }) => ({
      default: MapPage,
    })
  )
);

export const About = lazy(() =>
  import(/* webpackChunkName: "about-page" */ '../AboutPage/AboutPage').then(
    ({ AboutPage }) => ({
      default: AboutPage,
    })
  )
);

export const NotFound = lazy(() =>
  import(
    /* webpackChunkName: "not-found-page" */ '../NotFoundPage/NotFoundPage'
  ).then(({ NotFoundPage }) => ({
    default: NotFoundPage,
  }))
);
