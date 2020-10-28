import classNames from 'classnames/bind';
import React, { Fragment, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
} from 'reactstrap';
import STYLES from './AboutPage.module.scss';

const c = classNames.bind(STYLES);

export const AboutPage: React.FunctionComponent = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Fragment>
      <Helmet>
        <title>GR-20 - About</title>
      </Helmet>
      <div className={c('AboutPage')}>
        <Navbar color="dark" dark expand="sm">
          <div className="container">
            <NavbarBrand tag={Link} to="/" title="Home">
              GR-20
            </NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink tag={Link} to="/map/">
                    Routes
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} to="/kit/">
                    Kit
                  </NavLink>
                </NavItem>
                <NavItem active>
                  <NavLink tag={Link} to="/about/">
                    About
                  </NavLink>
                </NavItem>
              </Nav>
            </Collapse>
          </div>
        </Navbar>
        <div className="container">
          <div className="mt-3">
            <h1>About this GR-20 site</h1>
          </div>
          <p className="lead">
            This is a hobby fan site made for the GR-20 route in Corsica,
            France. The intention is to provide useful resources to help{' '}
            <a href="https://github.com/badsyntax">me</a> and you plan and
            explore the route/s and island.
          </p>
          <div className="mt-3">
            <h2>Goals</h2>
          </div>
          <p>
            Here are some high-level goals I'd like to achieve with this site,
            in no particular order:
          </p>
          <ul>
            <li>
              0 maintenance overhead - I want to be able to step away from this
              project at any point.
              <ul>
                <li>
                  No reliance on any custom server-side tech for runtime. Purely
                  front-end application that calls remote API's.
                </li>
                <li>
                  No fees to pay (hosted on a free service, like GitHub pages)
                </li>
              </ul>
            </li>
            <li>
              Use and share open data. Not-for profit. Open-source. All for
              passion of the route.
            </li>
            <li>
              Collaborative effort.
              <ul>
                <li>
                  I need help with the GPS data. I would like to have GPX routes
                  for the variants and other routes on the island. I plan to
                  record more data when I do the route again in June 2019 but if
                  anyone wants to submit their GPS data it would super useful!
                </li>
                <li>
                  If you'd like to contribute, you can so via GitHub. Just{' '}
                  <a href="https://github.com/badsyntax/gr-20/issues">
                    create an issue{' '}
                  </a>{' '}
                  to get a conversation going. If you don't have an account
                  you'll need to sign-up but it's free.
                </li>
              </ul>
            </li>
          </ul>
          <div className="mt-3">
            <h2>Tech used</h2>
          </div>
          <ul>
            <li>OpenLayers V5</li>
            <li>OpenStreetMap</li>
            <li>React</li>
            <li>Bootstrap</li>
          </ul>
          <div className="mt-3">
            <h2>Other Resources</h2>
            <ul>
              <li>
                <a href="http://corsica.forhikers.com/forum/gr-20">
                  http://corsica.forhikers.com/forum/gr-20
                </a>
              </li>
              <li>
                <a href="https://gr20corsica.wordpress.com/about/">
                  https://gr20corsica.wordpress.com/about/
                </a>
              </li>
              <li>
                <a href="http://www.le-gr20.fr/en/">
                  http://www.le-gr20.fr/en/
                </a>
              </li>
              <li>
                <a href="https://www.cicerone.co.uk/the-gr20-corsica">
                  https://www.cicerone.co.uk/the-gr20-corsica
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
