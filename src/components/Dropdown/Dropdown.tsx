import React, { useState } from 'react';
import { ButtonDropdown } from 'reactstrap';

export const Dropdown: React.FunctionComponent = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const onMouseEnter = () => {
    setIsOpen(true);
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <ButtonDropdown
      isOpen={isOpen}
      toggle={toggle}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </ButtonDropdown>
  );
};

export default Dropdown;
