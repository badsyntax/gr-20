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

import STYLES from "./Form.module.scss";

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(
      {
        showElevationProfile: false
      },
      props.values
    );
  }

  onChange = event => {
    const { onChange } = this.props;
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState(
      {
        [name]: value
      },
      () => onChange(this.state)
    );
  };

  render() {
    const { showElevationProfile, map, route } = this.state;
    const { mapOptions, routeOptions } = this.props;
    return (
      <form className={STYLES.Form}>
        <ButtonToolbar>
          <ButtonGroup>
            <Dropdown>
              <DropdownToggle
                caret
                color="secondary"
                className={STYLES.DropDown}
              >
                Routes
              </DropdownToggle>
              <DropdownMenu right>
                {routeOptions.map(({ name, url }) => (
                  <DropdownItem
                    key={name}
                    onClick={eventKey => {
                      this.onChange({
                        target: {
                          name: "route",
                          value: url
                        }
                      });
                    }}
                  >
                    {route === url ? (
                      <IoMdCheckmark />
                    ) : (
                      <span
                        style={{ paddingLeft: "1em", display: "inline-block" }}
                      />
                    )}{" "}
                    {name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownToggle
                caret
                color="secondary"
                className={STYLES.DropDown}
              >
                Maps
              </DropdownToggle>
              <DropdownMenu right>
                {mapOptions.map(({ name, url }) => (
                  <DropdownItem
                    key={name}
                    onClick={eventKey => {
                      this.onChange({
                        target: {
                          name: "map",
                          value: url
                        }
                      });
                    }}
                  >
                    {map === url ? (
                      <IoMdCheckmark />
                    ) : (
                      <span
                        style={{ paddingLeft: "1em", display: "inline-block" }}
                      />
                    )}{" "}
                    {name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown>
              <DropdownToggle
                caret
                color="secondary"
                className={STYLES.DropDown}
              >
                Options
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <FormGroup check>
                    <Label
                      check
                      onClick={event => {
                        event.stopPropagation();
                      }}
                    >
                      <Input
                        name="showElevationProfile"
                        type="checkbox"
                        checked={showElevationProfile}
                        onChange={this.onChange}
                      />{" "}
                      Show elevation profile
                    </Label>
                  </FormGroup>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </ButtonGroup>
        </ButtonToolbar>
      </form>
    );
  }
}

Form.propTypes = {
  onChange: PropTypes.func.isRequired,
  values: PropTypes.shape().isRequired,
  mapOptions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired,
  routeOptions: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string
    })
  ).isRequired
};

export default Form;
