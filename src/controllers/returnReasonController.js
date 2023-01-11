const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CustomError = require("../errors");
const retrieveSchema = require("../retrieveSchema");

const createReturnReason = async (req, res) => {
  const { title } = req.body;

  await prisma.returnReason.create({
    data: {
      title,
    },
  });

  res.status(StatusCodes.CREATED).json({});
};

const getAllReturnReasons = async (req, res) => {
  const returnReasons = await prisma.returnReason.findMany({
    select: retrieveSchema.returnReason,
  });

  res.status(StatusCodes.OK).json({ returnReasons });
};

const updateReturnReason = async (req, res) => {
  const {
    params: { id: returnReasonId },
    body: { title },
  } = req;

  const returnReason = await prisma.returnReason.findUnique({
    where: {
      id: returnReasonId,
    },
  });

  if (!returnReason) {
    throw new CustomError.NotFoundError(
      `No return reason found with id of ${returnReasonId}`
    );
  }

  await prisma.returnReason.update({
    data: {
      title,
    },
    where: {
      id: returnReasonId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

const deleteReturnReason = async (req, res) => {
  const { id: returnReasonId } = req.params;

  await prisma.returnReason.delete({
    where: {
      id: returnReasonId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

module.exports = {
  createReturnReason,
  getAllReturnReasons,
  updateReturnReason,
  deleteReturnReason,
};
