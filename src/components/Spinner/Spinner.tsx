import React from 'react';
import { useSelector } from 'react-redux';
import TopBarProgress from 'react-topbar-progress-indicator';
import { RootState } from '../../store';

TopBarProgress.config({
  barColors: {
    0: 'yellow',
    '1.0': 'yellow',
  },
  shadowBlur: 5,
  barThickness: 3,
});

export const Spinner: React.FunctionComponent = (props) => {
  const { isVisible } = useSelector((state: RootState) => state.spinner);
  document.body.style.cursor = isVisible ? 'progress' : 'default';
  return isVisible ? <TopBarProgress /> : null;
};
