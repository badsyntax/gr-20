import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormGroup,
  Label,
  Input,
  ButtonGroup,
  ButtonToolbar
} from "reactstrap";

import { IoMdCheckmark } from "react-icons/io";

import Dropdown from "../Dropdown/Dropdown";

import STYLES from "./DropdownGroup.module.scss";

class DropdownGroup extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {
        showElevationProfile: false
      },
      {
        values: props.values
      }
    );
  }

  onChange = event => {
    const { onChange } = this.props;
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState(
      ({ values }) => ({
        values: {
          ...values,
          [name]: value
        }
      }),
      () => {
        const { values } = this.state;
        onChange(values);
      }
    );
  };

  render() {
    const { values } = this.state;
    const { dropdowns } = this.props;
    return (
      <form className={STYLES.DropdownGroup}>
        <ButtonToolbar>
          <ButtonGroup>
            {dropdowns.map(
              ({
                label: dropdownLabel,
                name: dropdownName,
                type,
                items,
                isSelected
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
                      type === "formGroup" ? (
                        <DropdownItem key={inputName}>
                          <FormGroup check>
                            <Label
                              check
                              onClick={event => {
                                event.stopPropagation();
                              }}
                            >
                              <Input
                                name={inputName}
                                type="checkbox"
                                checked={values[inputName]}
                                onChange={this.onChange}
                              />{" "}
                              {label}
                            </Label>
                          </FormGroup>
                        </DropdownItem>
                      ) : (
                        <DropdownItem
                          key={inputName}
                          onClick={eventKey => {
                            this.onChange({
                              target: {
                                name: dropdownName,
                                value: url
                              }
                            });
                          }}
                        >
                          {url === values[dropdownName] ? (
                            <IoMdCheckmark />
                          ) : (
                            <span
                              style={{
                                paddingLeft: "1em",
                                display: "inline-block"
                              }}
                            />
                          )}{" "}
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
  dropdowns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      name: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          label: PropTypes.string,
          url: PropTypes.string
        })
      )
    })
  ).isRequired
};

export default DropdownGroup;
