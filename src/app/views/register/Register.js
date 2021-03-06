// @flow

// #region imports
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ErrorAlert, WarningAlert } from '../../components';
import { type Match, type Location, type RouterHistory } from 'react-router';
import {
  type SetLoadingStateForUserRegister,
  type UnsetLoadingStateForUserRegister,
  type ReceivedUserRegister,
  type ErrorUserRegister,
} from '../../redux/modules/userAuth.types';
// #endregion

// #region flow types
export type CreateUserInput = {
  user: {
    username: string,
    password: string,
  },
};

export type Props = {
  // react-router 4:
  match: Match,
  location: Location,
  history: RouterHistory,

  // registerUser apollo mutation
  registerUser: ({
    user: {
      username: string,
      password: string,
    },
  }) => any,

  // views props:
  currentView: string,

  // user Auth props:
  userIsAuthenticated: boolean,
  mutationLoading: boolean,
  receivedUserRegister: ReceivedUserRegister,
  setLoadingStateForUserRegister: SetLoadingStateForUserRegister,
  unsetLoadingStateForUserRegister: UnsetLoadingStateForUserRegister,
  errorUserRegister: ErrorUserRegister,

  // errors:
  error: any,

  // views
  enterRegister: () => any,
  leaveRegister: () => any,

  ...any,
};

export type State = {
  email: string,
  password: string,
  warning: any,

  ...any,
};
// #endregion

// #region styled-components
const RegisterButton = styled.button`
  margin-left: 10px;
`;
// #endregion

class Register extends PureComponent<Props, State> {
  state = {
    viewEntersAnim: true,
    email: '',
    password: '',
    warning: null,
  };

  componentDidMount() {
    const { enterRegister } = this.props;
    enterRegister();
  }

  componentWillUnmount() {
    const { leaveRegister } = this.props;
    leaveRegister();
  }

  render() {
    const { email, password, warning } = this.state;
    const { mutationLoading, error } = this.props;

    return (
      <div>
        <div className="row">
          <div className="col-md-4 col-md-offset-4">
            <form className="form-horizontal" noValidate>
              <fieldset>
                <legend>Register</legend>
                <div className="form-group">
                  <label
                    htmlFor="inputEmail"
                    className="col-lg-2 control-label"
                  >
                    Email
                  </label>
                  <div className="col-lg-10">
                    <input
                      type="text"
                      className="form-control"
                      id="inputEmail"
                      placeholder="Email"
                      value={email}
                      onChange={this.handlesOnEmailChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label
                    htmlFor="inputPassword"
                    className="col-lg-2 control-label"
                  >
                    Password
                  </label>
                  <div className="col-lg-10">
                    <input
                      type="password"
                      className="form-control"
                      id="inputPassword"
                      placeholder="Password"
                      value={password}
                      onChange={this.handlesOnPasswordChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="col-lg-10 col-lg-offset-2">
                    <Link className="btn btn-default" to={'/'}>
                      Cancel
                    </Link>
                    <RegisterButton
                      className="btn btn-primary"
                      disabled={mutationLoading}
                      onClick={this.handlesOnRegister}
                    >
                      Register
                    </RegisterButton>
                  </div>
                </div>
              </fieldset>
            </form>
            <div style={{ height: '150px' }}>
              <WarningAlert
                showAlert={!!warning}
                warningTitle={'Warning'}
                warningMessage={warning ? warning.message : ''}
                onClose={this.closeWarning}
              />
              <ErrorAlert
                showAlert={!!error}
                errorTitle={'Error'}
                errorMessage={error ? error.message : ''}
                onClose={this.closeError}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  handlesOnEmailChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      // $FlowIgnore
      const email = event.target.value;
      this.setState({ email });
    }
  };

  handlesOnPasswordChange = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
      // should add some validator before setState in real use cases
      this.setState({
        // $FlowIgnore
        password: event.target.value,
      });
    }
  };

  handlesOnRegister = async (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }

    const { registerUser, history } = this.props;
    const { email, password } = this.state;

    const user = {
      username: email,
      password: password,
    };

    // const { resetStore } = this.props;
    // resetStore();
    this.setState({ warning: null });

    if (!this.isValidEmail(email)) {
      this.setState({ warning: { message: 'Email is not valid.' } });
      return;
    }

    if (!this.isValidPassword(password)) {
      this.setState({
        warning: { message: 'Password is empty or not valid.' },
      });
      return;
    }

    try {
      await registerUser({ user });
      history.push({ pathname: '/protected' });
    } catch (error) {
      console.log('register user went wrong..., error: ', error);
    }
  };

  isValidEmail(email: string = '') {
    // basic validation, better user "validate.js" for real validation
    if (email && email.trim().length > 0) {
      return true;
    }
    return false;
  }

  isValidPassword(password: string = '') {
    // basic validation, better user "validate.js" for real validation
    if (password && password.trim().length > 0) {
      return true;
    }
    return false;
  }

  closeError = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }

    // const { resetStore } = this.props;
    // resetStore();
  };

  closeWarning = (event: SyntheticEvent<>) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({ warning: null });
  };
}

export default Register;
