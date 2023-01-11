const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CustomError = require("../errors");
const customUtils = require("../utils");
const retrieveSchema = require("../retrieveSchema");
const modelMethods = require("../model-methods");

const createReview = async (req, res) => {
  const {
    params: { productId },
    body: { rating, comment },
    user: { userId },
  } = req;

  const isValidProduct = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(
      `No product found with id of ${productId}`
    );
  }

  const alreadySubmitted = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (alreadySubmitted) {
    throw new CustomError.ConflictError("Review already submitted");
  }

  await prisma.review.create({
    data: {
      rating,
      comment,
      userId,
      productId,
    },
  });

  const { _avg } = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      productId,
    },
  });

  const numOfReviews = await prisma.review.count({
    where: {
      productId,
    },
  });

  await prisma.product.update({
    data: {
      averageRating: _avg.rating,
      numOfReviews,
    },
    where: {
      id: productId,
    },
  });

  res.status(StatusCodes.CREATED).json({});
};

const getProductReviews = async (req, res) => {
  const { productId } = req.params;

  const page = +req.query.page || 1;
  const take = 10;
  const skip = (page - 1) * take;

  const reviews = await prisma.review.findMany({
    skip,
    take,
    where: {
      productId,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
    select: retrieveSchema.review,
  });

  const totalReviews = await prisma.review.count({
    where: {
      productId,
    },
  });

  const numOfPages = Math.ceil(totalReviews / take);

  res.status(StatusCodes.OK).json({ reviews, totalReviews, numOfPages });
};

const updateReview = async (req, res) => {
  const {
    params: { id: reviewId },
    body,
  } = req;

  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with id of ${reviewId}`
    );
  }

  customUtils.checkPermissions(req.user, review.userId);

  await prisma.review.update({
    data: {
      ...body,
    },
    where: {
      id: reviewId,
    },
  });

  const { _avg } = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      productId: review.productId,
    },
  });

  await prisma.product.update({
    data: {
      averageRating: _avg.rating,
    },
    where: {
      id: review.productId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new CustomError.NotFoundError(
      `No review found with id of ${reviewId}`
    );
  }

  customUtils.checkPermissions(req.user, review.userId);

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  const { _avg } = await prisma.review.aggregate({
    _avg: {
      rating: true,
    },
    where: {
      productId: review.productId,
    },
  });

  const numOfReviews = await prisma.review.count({
    where: {
      productId: review.productId,
    },
  });

  await prisma.product.update({
    data: {
      averageRating: _avg.rating,
      numOfReviews,
    },
    where: {
      id: review.productId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
