import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Meteor } from 'meteor/meteor';

import {
  Button,
  Header,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
} from 'semantic-ui-react';

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
      sidebarVisible: false,
    };
    this.logout = this.logout.bind(this);
    this.openSidebar = this.openSidebar.bind(this);
    this.closeSidebar = this.closeSidebar.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ showConnectionIssue: true });
    }, CONNECTION_ISSUE_TIMEOUT);
  }

  openSidebar() {
    this.setState({ sidebarVisible: true });
  }

  closeSidebar(event) {
    if (event != null) {
      event.preventDefault();
    }
    this.setState({ sidebarVisible: false });
  }

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

  renderContent(location) {
    const { user, connected, lists, loading } = this.props;
    const { showConnectionIssue } = this.state;

    const commonChildProps = {
      // sidebarVisible: this.state.sidebarVisible,
    };

    return (
      <div style={{ height: '100vh' }}>
        <Sidebar.Pushable as={Segment}>
          <Sidebar
            as={Menu}
            animation="push"
            direction="left"
            icon="labeled"
            inverted
            onHide={this.closeSidebar}
            vertical
            visible={this.state.sidebarVisible}
            width="thin"
          >
            <Menu.Item as="a" onClick={this.closeSidebar}>
              <Icon name="arrow left" />
            </Menu.Item>
            <Menu.Item>
              <Icon type="global" />
              <span>
                <LanguageToggle style={{ paddingLeft: '36px' }} />
              </span>
            </Menu.Item>
            <Menu.Item>
              <UserMenu user={user} logout={this.logout} />
            </Menu.Item>
            <Menu.Item>
              <ListList lists={lists} />
            </Menu.Item>
          </Sidebar>

          <Sidebar.Pusher dimmed={this.state.sidebarVisible}>
            <Segment basic>
              {showConnectionIssue && !connected ? (
                <ConnectionNotification />
              ) : null}
              {loading ? (
                <Loading key="loading" />
              ) : (
                <Switch location={location}>
                  <Route
                    path="/lists/:id"
                    render={({ match }) => (
                      <ListPageContainer
                        match={match}
                        {...commonChildProps}
                        openSidebar={this.openSidebar}
                      />
                    )}
                  />
                  <Route
                    path="/signin"
                    render={() => (
                      <AuthPageSignIn
                        {...commonChildProps}
                        openSidebar={this.openSidebar}
                      />
                    )}
                  />
                  <Route
                    path="/join"
                    render={() => (
                      <AuthPageJoin
                        {...commonChildProps}
                        openSidebar={this.openSidebar}
                      />
                    )}
                  />
                  <Route
                    path="/*"
                    render={() => (
                      <NotFoundPage
                        {...commonChildProps}
                        openSidebar={this.openSidebar}
                      />
                    )}
                  />
                </Switch>
              )}
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
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
  // all lists visible to the current user
  lists: PropTypes.array,
};

App.defaultProps = {
  user: null,
  lists: [],
};
