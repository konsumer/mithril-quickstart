var m = require('mithril');

var Navbar = require('../components/Navbar.js');
var Auth = require('../models/Auth.js');

var Login = module.exports = {
  controller: function(){
    var ctrl = this;
    ctrl.navbar = new Navbar.controller();
    ctrl.error = m.prop('');
    this.login = function(e){
      e.preventDefault();
      Auth.login(e.target.email.value, e.target.password.value)
        .then(function(){
          m.route(Auth.originalRoute || '/', null, true);
        }, function(err){
          ctrl.error(m(".alert.alert-danger.animated.fadeInUp", err.message));
        });
    };
  },

  view: function(ctrl){
    return [Navbar.view(ctrl.navbar), m(".container", [
      m("form.text-center.row.form-signin", {onsubmit:ctrl.login.bind(ctrl)},
        m('.col-sm-6.col-sm-offset-3', [
          m("h1", "login"),
          ctrl.error(),
          m('.form-group', [
            m("label.sr-only[for='inputEmail']", "Email address"),
            m("input.form-control[name='email'][autofocus][id='inputEmail'][placeholder='Email address'][required][type='email']"),
          ]),
          m('.form-group', [
            m("label.sr-only[for='inputPassword']", "Password"),
            m("input.form-control[name='password'][autocomplete='off'][id='inputPassword'][placeholder='Password'][required][type='password']"),
          ]),
          m('.form-group',
            m("button.btn.btn-lg.btn-primary.btn-block[type='submit']", "Sign in")
          )
        ])
      )
    ])];
  }
};