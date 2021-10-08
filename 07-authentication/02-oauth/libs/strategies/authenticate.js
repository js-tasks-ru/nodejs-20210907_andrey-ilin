const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    done(null, false, 'Не указан email');
    return;
  }

  const user = await User.findOne({ email });
  if (user) {
    done(null, user);
  } else {
    try {
      const u = new User({ email, displayName });
      const savedU = await u.save();
      done(null, savedU);
    } catch (err) {
      done(err);
    }
  }
};
