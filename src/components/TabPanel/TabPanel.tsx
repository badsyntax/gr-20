import React, { memo } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value?: number;
}

export const TabPanel: React.FunctionComponent<TabPanelProps> = memo(
  ({ children, value, index, ...rest }) => {
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...rest}
      >
        {value === index && children}
      </div>
    );
  }
);
