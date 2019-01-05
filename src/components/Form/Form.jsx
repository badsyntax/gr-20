/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Dropdown, { MenuItem } from "@trendmicro/react-dropdown";
import "@trendmicro/react-buttons/dist/react-buttons.css";
import "@trendmicro/react-dropdown/dist/react-dropdown.css";
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
    const { showElevationProfile, map } = this.state;
    const { mapOptions } = this.props;
    return (
      <form className={STYLES.Form}>
        <Dropdown onSelect={eventKey => {}} autoOpen pullRight>
          <Dropdown.Toggle btnStyle="flat">Maps</Dropdown.Toggle>
          <Dropdown.Menu>
            {/* <MenuItem header>Header</MenuItem>
            <MenuItem eventKey={1}>link</MenuItem>
            <MenuItem divider />
            <MenuItem header>Header</MenuItem>
            <MenuItem eventKey={2}>link</MenuItem>
            <MenuItem eventKey={3} disabled>
              disabled
            </MenuItem>
            <MenuItem eventKey={4} title="link with title">
              link with title
            </MenuItem>
            <MenuItem
              eventKey={5}
              active
              onSelect={eventKey => {
                alert(`Alert from menu item.\neventKey: ${eventKey}`);
              }}
            >
              link that alerts
            </MenuItem> */}

            {mapOptions.map(({ name, url }) => (
              <MenuItem
                key={name}
                active={map === url}
                onSelect={eventKey => {
                  // console.log("url", url);
                  this.onChange({
                    target: {
                      name: "map",
                      value: url
                    }
                  });
                  // this.setState(({ formValues }) => ({
                  //   formValues: {
                  //     ...formValues,
                  //     map: url
                  //   }
                  // }));
                  // alert(`Alert from menu item.\neventKey: ${eventKey}`);
                }}
              >
                {name}
              </MenuItem>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown
          onSelect={(eventKey, e) => console.log("SELECT", e)}
          pullRight
          onToggle={e => console.log("on toggle", e)}
          autoOpen
        >
          <Dropdown.Toggle btnStyle="flat">Options</Dropdown.Toggle>
          <Dropdown.Menu>
            <MenuItem
              onSelect={(evtKey, evt) => {
                // console.log("evt", evt);
                evt.stopPropagation();
                return false;
              }}
            >
              <label
                onClick={event => {
                  event.stopPropagation();
                }}
              >
                <input
                  name="showElevationProfile"
                  type="checkbox"
                  checked={showElevationProfile}
                  onChange={this.onChange}
                />
                Show elevation profile
              </label>
            </MenuItem>
          </Dropdown.Menu>
        </Dropdown>
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
  ).isRequired
};

export default Form;
