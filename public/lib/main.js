'use strict';
// require('webrtc-adapter');
var $ = require('jquery');
import React from 'react';
// var store = require('./store.js');
import store from './store.js';
import ReactDOM from 'react-dom';
import Hello from './recordButtons.js';


ReactDOM.render(<Hello/>, document.getElementById('reactapp'));
