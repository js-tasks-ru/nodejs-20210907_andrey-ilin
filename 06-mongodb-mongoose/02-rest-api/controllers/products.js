const Product = require('../models/Product');
const mongoose = require('mongoose');

const mapToResponseDTO = (product) => {
  return {
      id: product._id,
      title: product.title,
      images: product.images,
      category: product.category,
      subcategory: product.subcategory,
      price: product.price,
      description: product.description,
  }
}

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const {subcategory} = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({ subcategory: { $eq: subcategory } })
  ctx.body = { products: products.length ? products.map((product) => mapToResponseDTO(product)) : [] };
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = { products: products.length ? products.map((product) => mapToResponseDTO(product)) : [] };
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  if (!mongoose.isValidObjectId(id)) {
    ctx.status = 400;
    ctx.body = { message: 'Invalid product id provided' };
    return;
  }
  const product = await Product.findById(id);

  if (!product) {
    ctx.status = 404;
    ctx.body = { message: 'Product not found' };
    return;
  }

  ctx.body = { product: mapToResponseDTO(product) };
};

