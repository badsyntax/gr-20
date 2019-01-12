import React from 'react';
import PropTypes from 'prop-types';

import TopBarProgress from 'react-topbar-progress-indicator';
import { SpinnerContext } from './SpinnerProvider';

TopBarProgress.config({
  barColors: {
    '0': 'yellow',
    '1.0': 'yellow',
  },
  shadowBlur: 5,
  barThickness: 3,
});

const Spinner = props => {
  const { isOpen } = props;
  document.body.style.cursor = isOpen ? 'progress' : 'default';
  return isOpen ? <TopBarProgress /> : null;
};

Spinner.propTypes = {
  isOpen: PropTypes.bool.isRequired,
};

export default props => (
  <SpinnerContext.Consumer>
    {context => <Spinner isOpen={context.isOpen} />}
  </SpinnerContext.Consumer>
);
