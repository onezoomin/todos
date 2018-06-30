import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Meteor } from 'meteor/meteor';

import { Lists } from '../../api/lists/lists.js';
import UserMenu from '../components/UserMenu.jsx';
import ListList from '../components/ListList.jsx';
import LanguageToggle from '../components/LanguageToggle.jsx';
import ConnectionNotification from '../components/ConnectionNotification.jsx';
import Loading from '../components/Loading.jsx';
import ListPageContainer from '../containers/ListPageContainer.jsx';
import AuthPageSignIn from '../pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../pages/AuthPageJoin.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import ListHeader from '../components/ListHeader.jsx';

const CONNECTION_ISSUE_TIMEOUT = 5000;

import {
  Alignment,
  Button,
  Classes,
  H5,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Menu,
  MenuItem,
  Breadcrumb,
  Icon,
  Intent,
  Popover,
  PopoverInteractionKind,
  Position,
} from '@blueprintjs/core';

// import { Layout } from 'antd';
// const { Header, Content, Footer, Navbar } = Layout;
// const MenuItem = Menu.MenuItem;

export default class App extends Component {
  static getDerivedStateFromProps(nextProps) {
    // Store a default list path that can be redirected to from "/" when
    // the list is ready.
    const newState = { defaultList: null, redirectTo: null };
    if (!nextProps.loading) {
      const list = Lists.findOne();
      newState.defaultList = `/lists/${list._id}`;
    }
    return newState;
  }

  constructor(props) {
    super(props);
    this.state = {
      showConnectionIssue: false,
      defaultList: null,
      redirectTo: null,
    };
    // this.toggleMenu = this.toggleMenu.bind(this);
    // this.closeMenu = this.toggleMenu.bind(this, false);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  // toggleMenu() {
  //   this.props.menuOpen.set(!this.props.menuOpen.get());
  // }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logout() {
    Meteor.logout();
    this.setState({
      redirectTo: this.state.defaultList,
    });
  }

  renderRedirect(location) {
    const { redirectTo, defaultList } = this.state;
    const { pathname } = location;
    let redirect = null;
    if (redirectTo && redirectTo !== pathname) {
      redirect = <Redirect to={redirectTo} />;
    } else if (pathname === '/' && defaultList) {
      redirect = <Redirect to={defaultList} />;
    }
    return redirect;
  }
  state = {
    collapsed: false,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  renderContent(location) {
    const { user, connected, lists, menuOpen, loading } = this.props;
    const { showConnectionIssue } = this.state;

    const commonChildProps = {
      menuOpen: this.props.menuOpen,
    };
    return (
      <div style={{ minHeight: '100vh' }}>
        <Navbar className="pt-dark">
          <NavbarGroup align={Alignment.LEFT}>
            <NavbarHeading>Blueprint Navbar</NavbarHeading>
            <NavbarDivider />
            <Button
              className="pt-minimal"
              style={{ fontSize: '150%' }}
              className="trigger"
              icon={this.state.collapsed ? 'menu-open' : 'menu-closed'}
              onClick={this.toggle}
            />

            <Popover
              content={<LanguageToggle style={{ paddingLeft: '36px' }} />}
              enforceFocus={false}
              position={Position.BOTTOM_LEFT}
              interactionKind={PopoverInteractionKind.CLICK}
            >
              <Button
                icon="globe"
                text={this.state.collapsed ? '' : 'Language'}
              />
            </Popover>
            <Popover
              content={<UserMenu user={user} logout={this.logout} />}
              enforceFocus={false}
              position={Position.BOTTOM_LEFT}
              interactionKind={PopoverInteractionKind.CLICK}
            >
              <Button
                icon="mugshot"
                text={this.state.collapsed ? '' : 'User'}
              />
            </Popover>
            <Popover
              enforceFocus={false}
              position={Position.BOTTOM_LEFT}
              interactionKind={PopoverInteractionKind.CLICK}
              content={<ListList lists={lists} />}
            >
              <Button
                icon="tick-circle"
                text={this.state.collapsed ? '' : 'Lists'}
              />
            </Popover>
          </NavbarGroup>
        </Navbar>
        <div>
          <div style={{ margin: '0' }}>
            {showConnectionIssue && !connected ? (
              <ConnectionNotification />
            ) : null}
            <div className="content-overlay" onClick={this.closeMenu} />
            {loading ? (
              <Loading key="loading" />
            ) : (
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  classNames="fade"
                  timeout={200}
                >
                  <Switch location={location}>
                    <Route
                      path="/lists/:id"
                      render={({ match }) => (
                        <ListPageContainer
                          match={match}
                          {...commonChildProps}
                        />
                      )}
                    />
                    <Route
                      path="/signin"
                      render={() => <AuthPageSignIn {...commonChildProps} />}
                    />
                    <Route
                      path="/join"
                      render={() => <AuthPageJoin {...commonChildProps} />}
                    />
                    <Route
                      path="/*"
                      render={() => <NotFoundPage {...commonChildProps} />}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )}
          </div>
          <div
            style={{
              textAlign: 'center',
              position: 'fixed',
              width: '100%',
              bottom: 0,
            }}
          >
            Relies on:
            <a href="http://blueprintjs.com/">blueprintjs</a>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <BrowserRouter>
        <Route
          render={({ location }) =>
            this.renderRedirect(location) || this.renderContent(location)
          }
        />
      </BrowserRouter>
    );
  }
}

App.propTypes = {
  // current meteor user
  user: PropTypes.object,
  // server connection status
  connected: PropTypes.bool.isRequired,
  // subscription status
  loading: PropTypes.bool.isRequired,
  // is side menu open?
  menuOpen: PropTypes.object.isRequired,
  // all lists visible to the current user
  lists: PropTypes.array,
};

App.defaultProps = {
  user: null,
  lists: [],
};
