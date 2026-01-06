const jwt = require('jsonwebtoken');

module.exports = {
  decodeToken: (context, events, done) => {
    const token = context.vars.authToken;
    if (token) {
      const decoded = jwt.decode(token);
      context.vars.userId = decoded?.sub;
    }
    return done();
  },

  generateUsername: (context, events, done) => {
    context.vars.username = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    return done();
  }
};
