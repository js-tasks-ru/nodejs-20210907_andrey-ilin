const passport = require('../libs/passport');
const Session = require('../models/Session');

module.exports.login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = { error: info };
      return;
    }

    const token = await ctx.login(user);

    try {
      await Session.create({
        token,
        lastVisit: new Date(),
        user: user._id,
      });
    } catch (err) {
      console.error(err);
    }

    // const session = await Session.findOne({token:})

    ctx.body = { token };
  })(ctx, next);
};
