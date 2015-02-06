var m = require('mithril');
var Auth = require('../models/Auth.js');

var Navbar = module.exports = {
  controller: function() {
    var ctrl = this;

    var links = (Auth.token() ?
    [
      {label:'Tasty', href:'/tasty'},
      {label:'Logout', href:'/logout'}
    ]:[
      {label:'Login', href:'/login'},
      {label:'Register', href:'/register'}
    ])
    .map(function(l){
      return m("li" + (m.route() === l.href ? '.active': ''), m("a[href='" + l.href + "']", {config: m.route}, l.label));
    });

    ctrl.links = m.prop(links);

    ctrl.iconDirection = m.prop('down');

    ctrl.toggle = function(){
      ctrl.iconDirection( ctrl.iconDirection()=='up' ? 'down':'up' );
    };
  },

  view: function(ctrl) {
    return m("nav.navbar.navbar-inverse.navbar-fixed-top", [
      m(".container", [
        m(".navbar-header",
          m('button.navbar-toggle', {onclick: ctrl.toggle}, m('.glyphicon.glyphicon-chevron-' + ctrl.iconDirection())),
          m("a.navbar-brand[href='/']", {config: m.route}, "Your sweet app")
        ),
        m(".navbar-collapse." + ctrl.iconDirection(), 
          m("ul.nav.navbar-nav.navbar-right", ctrl.links())
        )
      ])
    ]);
  }
};