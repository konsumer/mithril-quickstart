var m = require('mithril');

var Auth = require('../models/Auth.js');

var Logout = module.exports = {
  controller: function(){
    Auth.logout();
    m.route('/');
  },

  view: function(ctrl){
  }
};