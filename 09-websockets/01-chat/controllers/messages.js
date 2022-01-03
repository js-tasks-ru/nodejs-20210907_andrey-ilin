const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const { _id } = ctx.user;
  const messages = await Message.find({ chat: _id }).limit(20);

  const responseList = messages.map((msg) => {
    const { date, text, user, _id } = msg;
    return {
      date,
      text,
      id: _id,
      user,
    };
  });

  ctx.body = { messages: [...responseList] };
};
