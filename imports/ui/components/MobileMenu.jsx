import React from 'react';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import BaseComponent from './BaseComponent.jsx';

class MobileMenu extends BaseComponent {
  constructor(props) {
    super(props);
    this.openSidebar = this.openSidebar.bind(this);
  }

  openSidebar(event) {
    event.preventDefault();
    this.setState(function() {
      this.props.openSidebar();
    });
  }

  render() {
    return (
      <div className="nav-group">
        <a href="#toggle-menu" className="nav-item" onClick={this.openSidebar}>
          <span
            className="icon-list-unordered"
            title={i18n.__('components.mobileMenu.showMenu')}
          />
        </a>
      </div>
    );
  }
}

MobileMenu.propTypes = {
  // openSidebar: PropTypes.func.isRequired,
};

export default MobileMenu;
