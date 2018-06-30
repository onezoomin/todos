import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Accounts } from 'meteor/accounts-base';
import i18n from 'meteor/universe:i18n';
import BaseComponent from '../components/BaseComponent.jsx';
import { withRouter } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import AuthPage from './AuthPage.jsx';
import { ReactiveVar } from 'meteor/reactive-var';

const isJoinLockedRV = new ReactiveVar(false); // will persist over internal app page nav, but not survive browser refresh

class JoinPage extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = Object.assign(this.state, {
      isJoinLocked: isJoinLockedRV.get(),
      errors: {},
    });
    this.onSubmit = this.onSubmit.bind(this);
    this.isJoinLockedRV = isJoinLockedRV;
  }

  onSubmit(event) {
    event.preventDefault();
    const email = this.email.value;
    const password = this.password.value;
    const confirm = this.confirm.value;
    const errors = {};

    if (!email) {
      errors.email = i18n.__('pages.authPageJoin.emailRequired');
    }
    if (!password) {
      errors.password = i18n.__('pages.authPageJoin.passwordRequired');
    }
    if (confirm !== password) {
      errors.confirm = i18n.__('pages.authPageJoin.passwordConfirm');
    }

    this.setState({ errors });
    if (Object.keys(errors).length) {
      return;
    }

    Accounts.createUser(
      {
        email,
        password,
      },
      (err) => {
        if (err) {
          this.setState({
            errors: { none: err.reason },
          });
        }
        //this.redirectTo('/'); //did not work
        //console.log('should Redirect');
        this.props.history.push('/');
      }
    );
  }
  toggleLocked = () => {
    this.isJoinLockedRV.set(!this.isJoinLockedRV.get());
    this.setState({
      isJoinLocked: !this.state.isJoinLocked,
    });
  };
  render() {
    const { errors } = this.state;
    const errorMessages = Object.keys(errors).map((key) => errors[key]);
    const errorClass = (key) => errors[key] && 'error';

    const content = (
      <div className="wrapper-auth">
        <h1 className="title-auth">{i18n.__('pages.authPageJoin.join')}</h1>
        <p className="subtitle-auth">
          {i18n.__('pages.authPageJoin.joinReason')}
        </p>
        <form onSubmit={this.onSubmit}>
          <div className="list-errors">
            {errorMessages.map((msg) => (
              <div className="list-item" key={msg}>
                {msg}
              </div>
            ))}
          </div>
          <div className={`input-symbol ${errorClass('email')}`}>
            <input
              type="email"
              name="email"
              ref={(c) => {
                this.email = c;
              }}
              placeholder={i18n.__('pages.authPageJoin.yourEmail')}
            />
            <span
              className="icon-email"
              title={i18n.__('pages.authPageJoin.yourEmail')}
            />
          </div>
          <div className={`input-symbol ${errorClass('password')}`}>
            <input
              type="password"
              name="password"
              ref={(c) => {
                this.password = c;
              }}
              placeholder={i18n.__('pages.authPageJoin.password')}
            />
            <span
              className="icon-lock"
              title={i18n.__('pages.authPageJoin.password')}
            />
          </div>
          <div className={`input-symbol ${errorClass('confirm')}`}>
            <input
              type="password"
              name="confirm"
              ref={(c) => {
                this.confirm = c;
              }}
              placeholder={i18n.__('pages.authPageJoin.confirmPassword')}
            />
            <span
              className="icon-lock"
              title={i18n.__('pages.authPageJoin.confirmPassword')}
            />
          </div>
          <button
            disabled={this.state.isJoinLocked}
            type="submit"
            className="btn-primary"
          >
            {this.state.isJoinLocked
              ? 'Joining Currently Disabled'
              : i18n.__('pages.authPageJoin.joinNow')}
          </button>
        </form>
      </div>
    );
    let isLoggedIn = Meteor.user() != undefined;

    console.log(this.isJoinLockedRV);
    const disbleJoin = !isLoggedIn ? (
      ''
    ) : (
      <Button
        className="joinLockButton"
        icon={this.state.isJoinLocked ? 'lock' : 'unlock'}
        text={this.state.isJoinLocked ? 'Unlock Joins' : 'Lock Joins'}
        onClick={this.toggleLocked}
      />
    );
    const link = (
      <div>
        <Link to="/signin" className="link-auth-alt">
          {i18n.__('pages.authPageJoin.haveAccountSignIn')}
        </Link>
        <br />
        {disbleJoin}
      </div>
    );

    return (
      this.renderRedirect() || (
        <AuthPage
          content={content}
          link={link}
          menuOpen={this.props.menuOpen}
        />
      )
    );
  }
}

JoinPage.propTypes = {
  menuOpen: PropTypes.object.isRequired,
};

export default withRouter(JoinPage);
