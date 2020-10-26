import React from 'react';
import * as Popper from 'popper.js';
import { useId } from '@uifabric/react-hooks';

import {
  DirectionalHint,
  ITooltipHostStyles,
  TooltipHost,
  IconButton,
  ICalloutProps,
} from '@fluentui/react';
import { Map } from 'ol';

const calloutProps: ICalloutProps = {
  gapSpace: 10,
  directionalHint: DirectionalHint.rightCenter,
};

const hostStyles: Partial<ITooltipHostStyles> = {
  root: { display: 'inline-block' },
};

export interface ZoomToExtentButtonControlProps {
  map: Map;
  tooltip: string;
}

interface ButtonControlProps {
  tooltip: string;
  iconName: string;
  onClick: () => void;
}

const ButtonControl: React.FunctionComponent<ButtonControlProps> = ({
  onClick,
  tooltip,
  iconName,
}) => {
  const tooltipId = useId('tooltip');
  return (
    // <div className={c(STYLES.ButtonControl__container, className)}>
    <TooltipHost
      content={tooltip}
      id={tooltipId}
      calloutProps={calloutProps}
      styles={hostStyles}
    >
      <IconButton
        primary
        iconProps={{ iconName }}
        title={tooltip}
        ariaLabel={tooltip}
        onClick={onClick}
        styles={{
          root: {
            background: 'white',
          },
        }}
      />
    </TooltipHost>
    // </div>
  );
};

export default ButtonControl;
