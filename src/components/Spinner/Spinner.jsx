import React from "react";
import MDSpinner from "react-md-spinner";

import STYLES from "./Spinner.module.scss";

const Spinner = () => (
  <div className={STYLES.Spinner__container}>
    <MDSpinner
      duration={1400}
      size={100}
      borderSize={8}
      singleColor="rgb(66, 165, 245)"
    />
  </div>
);

export default Spinner;
