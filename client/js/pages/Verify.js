var m = require('mithril');

var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');

var Verify = module.exports = {
  controller: function(){
    var ctrl = this;
    ctrl.navbar = new Navbar.controller();
    ctrl.message = m.prop();
    Auth.verify(m.route.param("code")).then(function(){
      ctrl.message([
        'Sweet. Now, you can ',
        m('a[href="/login"]', {config: m.route}, 'login'),
        '.'
      ]);
    }, function(){
      ctrl.message('Hmm, there was something wrong with that code. Check your email again.');
    });
  },
  
  view: function(ctrl){
    return [Navbar.view(ctrl.navbar), m('.container', [
      m('h1', 'verify'),
      ctrl.message()
    ])];
  }
};