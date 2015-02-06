var m = require('mithril');

var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');

var Tasty = module.exports = {
  controller: function(){
    var ctrl = this;
    ctrl.navbar = new Navbar.controller();
    ctrl.user = m.prop();
    Auth.req('/api/tasty').then(function(user){
      ctrl.user(m('pre.json', JSON.stringify(user, null, 2)));
    });
  },
  
  view: function(ctrl){
    return [Navbar.view(ctrl.navbar), m('.container', [
      m('h1', 'tasty'),
      m('p', 'this is a demo of locking things down on client & server. This is you:'),
      ctrl.user()
    ])];
  }
};