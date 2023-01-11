const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;

const prisma = new PrismaClient();

const CustomError = require("../errors");
const customUtils = require("../utils");
const modelMethods = require("../model-methods");
const retrieveSchema = require("../retrieveSchema");

const showCurrentUser = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
    select: retrieveSchema.user,
  });

  res.status(StatusCodes.OK).json({ user });
};

const uploadProfileImage = async (req, res) => {
  if (!req.files || !req.files.image) {
    throw new CustomError.BadRequestError("No file uploaded");
  }

  const profileImage = req.files.image;

  if (!profileImage.mimetype.startsWith("image")) {
    throw new CustomError.BadRequestError("Please upload an image");
  }

  const maxSize = 1024 * 1024;

  if (profileImage.size >= maxSize) {
    throw new CustomError.BadRequestError(
      "Please upload an image smaller than 1 MB"
    );
  }

  const result = await cloudinary.uploader.upload(profileImage.tempFilePath, {
    use_filename: true,
    folder: "fashion-factory/profile-images",
  });

  await fs.unlink(profileImage.tempFilePath);

  const { profileImageId: oldProfileImageId } = await prisma.user.findUnique({
    where: {
      id: req.user.userId,
    },
  });
  await prisma.user.update({
    data: { profileImage: result.secure_url, profileImageId: result.public_id },
    where: {
      id: req.user.userId,
    },
  });

  if (oldProfileImageId) {
    await cloudinary.uploader.destroy(oldProfileImageId);
  }

  res.status(StatusCodes.OK).json({
    profileImage: { src: result.secure_url },
  });
};

const removeProfileImage = async (req, res) => {
  const { profileImageId } = req.query;

  if (!profileImageId) {
    throw new CustomError.BadRequestError("Please provide profile image id");
  }

  const user = await prisma.user.findFirst({
    where: {
      profileImageId,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(
      `No file found with id of ${profileImageId}`
    );
  }

  customUtils.checkPermissions(req.user, user.id);

  await prisma.user.update({
    data: { profileImage: "", profileImageId: "" },
    where: {
      id: req.user.userId,
    },
  });

  await cloudinary.uploader.destroy(profileImageId);

  res.status(StatusCodes.OK).json({});
};

const updateUser = async (req, res) => {
  await prisma.user.update({
    data: req.body,
    where: {
      id: req.user.userId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

const deleteUser = async (req, res) => {
  const { userId } = req.user;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id of ${userId}`);
  }

  customUtils.checkPermissions(req.user, user.id);

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  if (user.profileImageId) {
    await cloudinary.uploader.destroy(user.profileImageId);
  }

  res.status(StatusCodes.OK).json({});
};

const getAllUsers = async (req, res) => {
  const { role, search } = req.query;

  let queryObject = {
    where: {},
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  };

  if (search) {
    queryObject.where = {
      ...queryObject.where,
      email: {
        startsWith: search,
      },
    };
  }

  if (role === "customer") {
    queryObject.where = {
      ...queryObject.where,
      role: "BASIC",
    };
  }

  if (role === "admin") {
    queryObject.where = {
      ...queryObject.where,
      role: "ADMIN",
    };
  }

  const page = +req.query.page || 1;
  const take = 10;
  const skip = (page - 1) * take;

  const users = await prisma.user.findMany({
    skip,
    take,
    ...queryObject,
    select: retrieveSchema.users,
  });

  const totalUsers = await prisma.user.count({
    ...queryObject,
  });
  const numOfPages = Math.ceil(totalUsers / take);

  res.status(StatusCodes.OK).json({ users, totalUsers, numOfPages });
};

const updateUserStatus = async (req, res) => {
  const {
    params: { id: userId },
    body,
  } = req;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id of ${userId}`);
  }

  if (user.role !== "ADMIN") {
    delete body.authorized;
  }

  await prisma.user.update({
    data: body,
    where: {
      id: userId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

const removeUser = async (req, res) => {
  const { id: userId } = req.params;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(`No user found with id of ${userId}`);
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  if (user.profileImageId) {
    await cloudinary.uploader.destroy(user.profileImageId);
  }

  res.status(StatusCodes.OK).json({});
};

module.exports = {
  showCurrentUser,
  uploadProfileImage,
  removeProfileImage,
  updateUser,
  deleteUser,
  getAllUsers,
  updateUserStatus,
  removeUser,
};
