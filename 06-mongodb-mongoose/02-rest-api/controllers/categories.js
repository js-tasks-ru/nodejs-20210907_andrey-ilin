const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();

  ctx.body = {categories: categories.map((category) => {
    return {
      id: category._id,
      title: category.title,
      subcategories: category.subcategories ? category.subcategories.map((subcategory) => {
        return {
          id: subcategory._id,
          title: subcategory.title
        }
      }) : []
    };
  })};
};
