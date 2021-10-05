const Product = require('../models/Product');

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

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;

  const products = await Product.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
 ).sort( { score: { $meta: 'textScore' } })

  ctx.body = {products: products.map((product) => mapToResponseDTO(product))};
};
