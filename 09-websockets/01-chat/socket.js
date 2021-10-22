const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function (socket, next) {
    const token = socket.handshake.query.token;

    if (!token) {
      next(new Error('anonymous sessions are not allowed'));
      return;
    }

    const session = await Session.findOne({ token }).populate('user');

    if (session) {
      socket.user = session.user;
      next();
    } else {
      next(new Error('wrong or expired session token'));
    }
  });

  io.on('connection', function (socket) {
    socket.on('message', async (msg) => {
      const message = new Message({
        date: new Date(),
        text: msg,
        chat: socket.user._id,
        user: socket.user.displayName,
      });

      await message.save();
    });
  });

  return io;
}

module.exports = socket;
