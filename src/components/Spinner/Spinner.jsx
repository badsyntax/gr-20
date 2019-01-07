import React from "react";

import TopBarProgress from "react-topbar-progress-indicator";

TopBarProgress.config({
  barColors: {
    "0": "yellow",
    "1.0": "yellow"
  },
  shadowBlur: 5,
  barThickness: 3
});

const Spinner = () => <TopBarProgress />;

export default Spinner;
