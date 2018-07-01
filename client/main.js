/* global document */

import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';

import 'semantic-ui-css/semantic.min.css';

import AppContainer from '../imports/ui/containers/AppContainer.jsx';

Meteor.startup(() => {
  render(<AppContainer />, document.getElementById('app'));
});
