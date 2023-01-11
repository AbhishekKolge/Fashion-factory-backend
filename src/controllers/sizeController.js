const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CustomError = require("../errors");
const retrieveSchema = require("../retrieveSchema");

const createSize = async (req, res) => {
  const { value } = req.body;

  await prisma.size.create({
    data: {
      value,
    },
  });

  res.status(StatusCodes.CREATED).json({});
};

const getAllSizes = async (req, res) => {
  const sizes = await prisma.size.findMany({
    select: retrieveSchema.size,
  });

  res.status(StatusCodes.OK).json({ sizes });
};

const updateSize = async (req, res) => {
  const {
    params: { id: sizeId },
    body: { value },
  } = req;

  const size = await prisma.size.findUnique({
    where: {
      id: sizeId,
    },
  });

  if (!size) {
    throw new CustomError.NotFoundError(`No size found with id of ${sizeId}`);
  }

  await prisma.size.update({
    data: {
      value,
    },
    where: {
      id: sizeId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

const deleteSize = async (req, res) => {
  const { id: sizeId } = req.params;

  await prisma.size.delete({
    where: {
      id: sizeId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

module.exports = {
  createSize,
  getAllSizes,
  updateSize,
  deleteSize,
};
