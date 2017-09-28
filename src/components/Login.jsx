/**
 * Import dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { connect } from 'react-redux';
import { userLoggedIn } from '../actions';
import './Login.scss';
import InputGroup from './InputGroup';

/**
 * Component class for Login
 */
class Login extends Component {
  /**
   * Constructor
   */
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: '',
        password: '',
      },
      submitted: false,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * Handle submit button click
   * TODO: Refactor
   */
  handleClick() {
    fetch('http://localhost:8080/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state),
    }).then(response => response.json()).then((body) => {
      if (body.error) {
        if (body.error.email) {
          // TODO display error when email not valid
          console.log(body.error.email);
        } else if (body.error.password) {
        // TODO display error when password not valid
          console.log(body.error.password);
        }
      } else {
        this.props.userLoggedIn(body.token);
        this.props.history.push('/');
      }
    });
  }

  /**
   * Handle form submit
   * TODO: Refactor
   */
  handleSubmit() {
    this.setState({ submitted: true }, () => {
      setTimeout(() => this.setState({ submitted: false }), 5000);
    });
  }

  /**
   * Handle input field change
   */
  handleChange(event) {
    const { formData } = this.state;
    formData[event.target.name] = event.target.value;
    this.setState({ formData });
  }

  render() {
    return (
      <div className="row content-wrapper">
        <form className="col-4 col-auto mr-auto ml-auto">
          <InputGroup
            field="email"
            label="Email"
            onChange={this.handleChange}
            type="email"
            value={this.state.formData.email}
          />
          <InputGroup
            field="password"
            label="Password"
            onChange={this.handleChange}
            type="password"
            value={this.state.formData.password}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={this.handleClick}
          >Submit
          </button>
        </form>
      </div>
    );
  }
}

/**
 * PropTypes
 */
Login.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  userLoggedIn: PropTypes.func.isRequired,
};

/**
 * Connect Redux with Component
 */
export default connect(
  null,
  dispatch => ({
    userLoggedIn: (token) => {
      dispatch(userLoggedIn(token));
    },
  }),
)(Login);
