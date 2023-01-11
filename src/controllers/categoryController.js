const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CustomError = require("../errors");
const retrieveSchema = require("../retrieveSchema");

const createCategory = async (req, res) => {
  const { name } = req.body;

  await prisma.category.create({
    data: {
      name,
    },
  });

  res.status(StatusCodes.CREATED).json({});
};

const getAllCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    select: retrieveSchema.category,
  });

  res.status(StatusCodes.OK).json({ categories });
};

const updateCategory = async (req, res) => {
  const {
    params: { id: categoryId },
    body: { name },
  } = req;

  const category = await prisma.category.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!category) {
    throw new CustomError.NotFoundError(
      `No category found with id of ${categoryId}`
    );
  }

  await prisma.category.update({
    data: {
      name,
    },
    where: {
      id: categoryId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params;

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
