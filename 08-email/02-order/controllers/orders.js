const Order = require('../models/Order');
const Product = require('../models/Product');
const sendMail = require('../libs/sendMail');
const mapProduct = require('../mappers/product');

module.exports.checkout = async function checkout(ctx, next) {
  const order = new Order({ ...ctx.request.body, user: ctx.user._id });
  const newOrder = await order.save();
  const product = await Product.findById(ctx.request.body.product);
  await sendMail({
    to: ctx.user.email,
    subject: 'Подтвердите почту',
    locals: { id: newOrder._id, product },
    template: 'order-confirmation',
  });

  ctx.body = { order: newOrder._id };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const productsByOrders = await Order.find({ user: ctx.user._id }).populate(
    'product'
  );

  const responseData = productsByOrders.map((order) => {
    return {
      id: order._id,
      user: order.user,
      product: mapProduct(order.product),
      phone: order.phone,
      address: order.address,
    };
  });

  ctx.body = { orders: responseData };
};
