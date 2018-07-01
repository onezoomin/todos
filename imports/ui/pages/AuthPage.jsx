import React from 'react';
import PropTypes from 'prop-types';
import MobileMenu from '../components/MobileMenu.jsx';

// a common layout wrapper for auth pages
const AuthPage = ({ content, link, openSidebar }) => (
  <div className="page auth">
    <nav>
      <MobileMenu openSidebar={openSidebar} />
    </nav>
    <div className="content-scrollable">
      {content}
      {link}
    </div>
  </div>
);

AuthPage.propTypes = {
  content: PropTypes.element.isRequired,
  link: PropTypes.element.isRequired,
  openSidebar: PropTypes.func.isRequired,
};

export default AuthPage;
