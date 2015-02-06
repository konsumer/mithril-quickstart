var m = require('mithril');

m.route.mode = 'pathname';

m.route(document.body, "/", {
  "/": require('./pages/Home.js'),
  "/login": require('./pages/Login.js'),
  "/logout": require('./pages/Logout.js'),
  "/register": require('./pages/Register.js'),
  "/verify/:code": require('./pages/Verify.js'),
  "/tasty": require('./pages/Tasty.js')
});