const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;

const prisma = new PrismaClient();

const CustomError = require("../errors");
const customUtils = require("../utils");
const retrieveSchema = require("../retrieveSchema");
const modelMethods = require("../model-methods");

const createProduct = async (req, res) => {
  if (!req.files || !req.files.image) {
    throw new CustomError.BadRequestError("Please provide product image");
  }
  const { image } = req.files;

  if (!image.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image");
  }

  const maxSize = 1024 * 1024;

  if (image.size >= maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload an image smaller than 1 MB"
    );
  }

  const existingProduct = await prisma.product.findUnique({
    where: {
      name: req.body.name,
    },
  });

  if (existingProduct) {
    throw new CustomError.ConflictError(
      `Product ${req.body.name} already exists`
    );
  }

  const result = await cloudinary.uploader.upload(image.tempFilePath, {
    use_filename: true,
    folder: "fashion-factory/product-images",
  });

  await fs.unlink(image.tempFilePath);

  const { constructedProduct, constructedSize } = new modelMethods.Product(
    req.body
  ).constructProduct();

  await prisma.product.create({
    data: {
      ...constructedProduct,
      image: result.secure_url,
      imageId: result.public_id,
      sizes: {
        connect: constructedSize.map((size) => ({ id: size })),
      },
    },
  });

  res.status(StatusCodes.CREATED).json({});
};

const getAllProducts = async (req, res) => {
  const { search, featured, sort, categoryId, sizeId, priceSort } = req.query;

  let queryObject = {
    where: {},
    orderBy: [],
  };

  if (search) {
    queryObject.where = {
      ...queryObject.where,
      name: {
        startsWith: search,
      },
    };
  }

  if (categoryId) {
    queryObject.where = {
      ...queryObject.where,
      categoryId,
    };
  }

  if (sizeId) {
    queryObject.where = {
      ...queryObject.where,
      sizes: {
        some: {
          id: sizeId,
        },
      },
    };
  }

  if (featured == 1) {
    queryObject.where = {
      ...queryObject.where,
      featured: true,
    };
  }

  if (priceSort === "highest") {
    queryObject.orderBy.push({
      price: "desc",
    });
  }

  if (priceSort === "lowest") {
    queryObject.orderBy.push({
      price: "asc",
    });
  }

  if (sort == "highest-rated") {
    queryObject.orderBy.push({
      averageRating: "desc",
    });
  }

  if (sort == "latest") {
    queryObject.orderBy.push({
      createdAt: "desc",
    });
  }

  if (sort == "oldest") {
    queryObject.orderBy.push({
      createdAt: "asc",
    });
  }

  if (sort === "a-z") {
    queryObject.orderBy.push({
      name: "asc",
    });
  }

  if (sort === "z-a") {
    queryObject.orderBy.push({
      name: "desc",
    });
  }

  if (!sort) {
    queryObject.orderBy.push({
      createdAt: "desc",
    });
  }

  const page = +req.query.page || 1;
  const take = 9;
  const skip = (page - 1) * take;

  const products = await prisma.product.findMany({
    skip,
    take,
    ...queryObject,
    select: retrieveSchema.products,
  });

  const totalProducts = await prisma.product.count({
    ...queryObject,
  });
  const numOfPages = Math.ceil(totalProducts / take);

  res.status(StatusCodes.OK).json({ products, totalProducts, numOfPages });
};

const updateProduct = async (req, res) => {
  const {
    params: { id: productId },
    body,
  } = req;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product) {
    throw new CustomError.NotFoundError(
      `No product found with id of ${productId}`
    );
  }

  const { constructedProduct, constructedSize } = new modelMethods.Product(
    body
  ).constructProduct();

  const image = req?.files?.image;

  if (image) {
    if (!image.mimetype.startsWith("image")) {
      throw new CustomError.BadRequestError("Please upload an image");
    }

    const maxSize = 1024 * 1024;

    if (image.size >= maxSize) {
      throw new CustomError.BadRequestError(
        "Please upload an image smaller than 1 MB"
      );
    }

    const result = await cloudinary.uploader.upload(image.tempFilePath, {
      use_filename: true,
      folder: "fashion-factory/product-images",
    });

    await fs.unlink(image.tempFilePath);

    constructedProduct.image = result.secure_url;
    constructedProduct.imageId = result.public_id;
  }

  let nestedUpdateQuery = {};

  if (constructedSize?.length) {
    nestedUpdateQuery.sizes = {
      set: [],
      connect: constructedSize.map((size) => ({ id: size })),
    };
  }

  await prisma.product.update({
    data: {
      ...constructedProduct,
      ...nestedUpdateQuery,
    },
    where: {
      id: productId,
    },
  });

  if (image && product.imageId) {
    await cloudinary.uploader.destroy(product.imageId);
  }

  res.status(StatusCodes.OK).json({});
};

const getSingleProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: retrieveSchema.product,
  });

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const { id: productId } = req.params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  await prisma.product.delete({
    where: {
      id: productId,
    },
  });

  if (product.imageId) {
    await cloudinary.uploader.destroy(product.imageId);
  }

  res.status(StatusCodes.OK).json({});
};

module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  getSingleProduct,
  deleteProduct,
};
