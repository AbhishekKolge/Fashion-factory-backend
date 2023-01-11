const CustomError = require("../errors");
const customUtils = require("../utils");

class Product {
  constructor(model) {
    this.model = model;
  }

  constructProduct() {
    const productStructure = this.model;

    const constructedProduct = {
      name: productStructure.name,
      price: productStructure.price ? +productStructure.price : 0,
      discount: productStructure.discount,
      discountAmount: productStructure.discountAmount
        ? +productStructure.discountAmount
        : 0,
      categoryId: productStructure.categoryId,
      featured: productStructure.featured === "true" ? true : false,
      color: productStructure.color,
      description: productStructure.description,
      inventory: productStructure.inventory ? +productStructure.inventory : 0,
    };

    const constructedSize =
      productStructure.sizes && JSON.parse(productStructure.sizes);

    for (const key in constructedProduct) {
      if (constructedProduct[key] === "" || constructedProduct[key] === null) {
        delete constructedProduct[key];
      }
    }

    return { constructedProduct, constructedSize };
  }
}

module.exports = Product;
