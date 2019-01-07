import React from "react";
import MDSpinner from "react-md-spinner";

import TopBarProgress from "react-topbar-progress-indicator";
import STYLES from "./Spinner.module.scss";

TopBarProgress.config({
  barColors: {
    "0": "yellow",
    // "0.5": "#0f0",
    "1.0": "yellow"
  },
  shadowBlur: 5,
  barThickness: 3
});

const Spinner = () => (
  <TopBarProgress />

  // <div className={STYLES.Spinner__container}>
  // {/* <MDSpinner
  //   duration={1400}
  //   size={100}
  //   borderSize={8}
  //   singleColor="rgb(66, 165, 245)"
  // /> */}
  // </div>
);

export default Spinner;
