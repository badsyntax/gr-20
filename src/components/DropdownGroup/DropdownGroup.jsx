import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  ButtonToolbar,
} from 'reactstrap';
import { IoMdCheckmark } from 'react-icons/io';
import Dropdown from '../Dropdown/Dropdown';
import { OptionsContext } from '../Options/OptionsProvider';

import STYLES from './DropdownGroup.module.scss';

class DropdownGroup extends Component {
  onChange = ({ target }) => {
    const { name, type, checked, value: targetValue } = target;
    const value = type === 'checkbox' ? checked : targetValue;
    const { onChange } = this.props;
    onChange(name, value);
  };

  render() {
    const { options, values } = this.props;
    return (
      <form className={STYLES.DropdownGroup}>
        <ButtonToolbar>
          <ButtonGroup>
            {options.map(
              ({
                label: dropdownLabel,
                name: dropdownName,
                type,
                items,
                isSelected,
              }) => (
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
                                checked={values[inputName]}
                                onChange={this.onChange}
                              />{' '}
                              {label}
                            </Label>
                          </FormGroup>
                        </DropdownItem>
                      ) : (
                        <DropdownItem
                          key={inputName}
                          onClick={(eventKey) => {
                            this.onChange({
                              target: {
                                name: dropdownName,
                                value: url,
                              },
                            });
                          }}
                        >
                          {url === values[dropdownName] ? (
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
  }
}

DropdownGroup.propTypes = {
  onChange: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          label: PropTypes.string,
          url: PropTypes.string,
        })
      ),
    })
  ).isRequired,
};

const DropdownGroupContainer = (props) => (
  <OptionsContext.Consumer>
    {({ dropdownOptions, values, onChange }) => (
      <DropdownGroup
        options={dropdownOptions}
        values={values}
        onChange={onChange}
        {...props}
      />
    )}
  </OptionsContext.Consumer>
);

export default DropdownGroupContainer;
