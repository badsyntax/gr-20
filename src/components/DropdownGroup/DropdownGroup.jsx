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
    const { showElevationProfile, map, route, showControls } = values;
    const { mapOptions, routeOptions } = this.props;
    return (
      <form className={STYLES.DropdownGroup}>
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
                <DropdownItem>
                  <FormGroup check>
                    <Label
                      check
                      onClick={event => {
                        event.stopPropagation();
                      }}
                    >
                      <Input
                        name="showControls"
                        type="checkbox"
                        checked={showControls}
                        onChange={this.onChange}
                      />{" "}
                      Show controls
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

DropdownGroup.propTypes = {
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

export default DropdownGroup;
