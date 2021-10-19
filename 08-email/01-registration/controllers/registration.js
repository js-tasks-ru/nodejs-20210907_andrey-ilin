const { v4: uuid } = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const { email, password, displayName } = ctx.request.body;
  const user = await User.findOne({ email });

  if (!user) {
    const verificationToken = uuid();
    const u = new User({ email, displayName, verificationToken });
    await u.setPassword(password);
    await u.save();
    await sendMail({
      template: 'confirmation',
      locals: { token: verificationToken },
      to: email,
      subject: 'Подтвердите почту',
    });
    ctx.status = 200;
    ctx.body = { status: 'ok' };
  } else {
    ctx.status = 400;
    ctx.body = { errors: { email: 'Такой email уже существует' } };
    return;
  }
};

module.exports.confirm = async (ctx, next) => {
  const { verificationToken } = ctx.request.body;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    ctx.status = 400;
    ctx.body = {
      error: 'Ссылка подтверждения недействительна или устарела',
    };
    return;
  } else {
    const token = uuid();

    try {
      await Session.create({
        token,
        lastVisit: new Date(),
        user: user._id,
      });
    } catch (err) {
      console.error(err);
    }

    user.verificationToken = undefined;

    await user.save();

    ctx.body = { token };
  }
};
