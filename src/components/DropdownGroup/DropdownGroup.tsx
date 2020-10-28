import React from 'react';
import { IoMdCheckmark } from 'react-icons/io';
import {
  ButtonGroup,
  ButtonToolbar,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
import Dropdown from '../Dropdown/Dropdown';
import { INPUT_TYPES } from '../Form/Form';
import { DropdownOption, SelectedOptions } from '../Settings/types';
import STYLES from './DropdownGroup.module.scss';

export interface DropdownOptionsProps {
  onChange: (name: string, value: string | boolean) => void;
  options: DropdownOption[];
  values: SelectedOptions;
}

export const DropdownGroup: React.FunctionComponent<DropdownOptionsProps> = ({
  onChange,
  options,
  values,
}) => {
  const onInputChange = ({ target }: { target: HTMLInputElement }) => {
    const { name, type, checked, value: targetValue } = target;
    const value = type === INPUT_TYPES.checkbox ? checked : targetValue;
    onChange(name, value);
  };

  return (
    <form className={STYLES.DropdownGroup}>
      <ButtonToolbar>
        <ButtonGroup>
          {options.map(
            ({ label: dropdownLabel, name: dropdownName, type, items }) => (
              <Dropdown key={dropdownLabel}>
                <DropdownToggle
                  caret
                  color="secondary"
                  className={STYLES.DropDown}
                >
                  {dropdownLabel}
                </DropdownToggle>
                <DropdownMenu right>
                  {items.map(({ name: inputName, label, url }) =>
                    type === 'formGroup' ? (
                      <DropdownItem
                        key={inputName}
                        className={STYLES['DropdownGroup__form-item']}
                      >
                        <FormGroup
                          check
                          className={STYLES['DropdownGroup__form-group']}
                        >
                          <Label
                            check
                            onClick={(event) => {
                              event.stopPropagation();
                            }}
                            className={STYLES['DropdownGroup__form-label']}
                          >
                            <Input
                              name={inputName}
                              type="checkbox"
                              checked={
                                !!values[inputName as keyof SelectedOptions]
                              }
                              onChange={onInputChange}
                            />{' '}
                            {label}
                          </Label>
                        </FormGroup>
                      </DropdownItem>
                    ) : (
                      <DropdownItem
                        key={inputName}
                        onClick={() => {
                          if (url) {
                            onChange(dropdownName, url);
                          }
                        }}
                      >
                        {url ===
                        values[dropdownName as keyof SelectedOptions] ? (
                          <IoMdCheckmark />
                        ) : (
                          <span
                            style={{
                              paddingLeft: '1em',
                              display: 'inline-block',
                            }}
                          />
                        )}{' '}
                        {inputName}
                      </DropdownItem>
                    )
                  )}
                </DropdownMenu>
              </Dropdown>
            )
          )}
        </ButtonGroup>
      </ButtonToolbar>
    </form>
  );
};
