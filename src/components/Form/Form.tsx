import React, { ChangeEvent } from 'react';
import { default as ReactStrapForm } from 'reactstrap/lib/Form';

export const INPUT_TYPES = {
  checkbox: 'checkbox',
};

export interface FormProps {
  onChange: (name: string, value: string | boolean) => void;
}

export const Form: React.FunctionComponent<FormProps> = ({
  onChange,
  children,
}) => {
  const onInputChange = (event: ChangeEvent<HTMLFormElement>) => {
    const { name, type, checked, value: targetValue } = event.target;
    const value = type === INPUT_TYPES.checkbox ? checked : targetValue;
    onChange(name, value);
  };

  return <ReactStrapForm onChange={onInputChange}>{children}</ReactStrapForm>;
};

export default Form;
