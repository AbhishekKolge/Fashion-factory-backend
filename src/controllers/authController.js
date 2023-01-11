const { StatusCodes } = require("http-status-codes");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CustomError = require("../errors");
const customUtils = require("../utils");
const modelMethods = require("../model-methods");

const register = async (req, res) => {
  delete req.body.role;

  const verificationToken = customUtils.createRandomBytes();

  const userData = await new modelMethods.User({
    ...req.body,
    verificationToken: customUtils.hashString(verificationToken),
  }).encryptPassword();

  const user = await prisma.user.create({
    data: userData,
  });

  await customUtils.sendVerificationEmail({
    name: user.firstName,
    email: user.email,
    verificationToken,
    origin: customUtils.getOrigin(req),
  });

  res.status(StatusCodes.CREATED).json({
    msg: `Email verification link sent to ${user.email}`,
  });
};

const adminRegister = async (req, res) => {
  req.body.role = "ADMIN";

  const verificationToken = customUtils.createRandomBytes();

  const userData = await new modelMethods.User({
    ...req.body,
    verificationToken: customUtils.hashString(verificationToken),
  }).encryptPassword();

  const user = await prisma.user.create({
    data: userData,
  });

  await customUtils.sendVerificationEmail({
    name: user.firstName,
    email: user.email,
    verificationToken,
    origin: customUtils.getOrigin(req),
  });

  res.status(StatusCodes.CREATED).json({
    msg: `Email verification link sent to ${user.email}`,
    token: verificationToken,
  });
};

const verify = async (req, res) => {
  const { email, token } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Verification failed");
  }

  if (user.isVerified) {
    throw new CustomError.BadRequestError("Already verified");
  }

  new modelMethods.User(user).compareVerificationToken(
    customUtils.hashString(token)
  );

  await prisma.user.update({
    data: {
      isVerified: true,
      verified: customUtils.currentTime(),
      verificationToken: "",
    },
    where: {
      email,
    },
  });

  res.status(StatusCodes.OK).json({ msg: "Email verified successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(
      `${email} does not exist, please register`
    );
  }

  new modelMethods.User(user).checkPasswordTokenValidity();

  const passwordToken = customUtils.createRandomBytes();

  await customUtils.sendResetPasswordEmail({
    name: user.firstName,
    email: user.email,
    passwordToken,
    origin: customUtils.getOrigin(req),
  });

  const tenMinutes = 1000 * 60 * 10;
  const passwordTokenExpiration = Date.now() + tenMinutes;

  await prisma.user.update({
    data: {
      passwordToken: customUtils.hashString(passwordToken),
      passwordTokenExpiration: customUtils.time(passwordTokenExpiration),
    },
    where: {
      email,
    },
  });

  res
    .status(StatusCodes.OK)
    .json({ msg: `Password reset link sent to ${user.email}` });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new CustomError.UnauthenticatedError("Verification failed");
  }

  new modelMethods.User(user).verifyPasswordToken(
    customUtils.hashString(token)
  );

  await prisma.user.update({
    data: {
      password,
      passwordToken: null,
      passwordTokenExpiration: null,
    },
    where: {
      email,
    },
  });

  res.status(StatusCodes.OK).json({ msg: "Password changed successfully" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      Token: true,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(
      `${email} does not exist, please register`
    );
  }

  const userModel = new modelMethods.User(user);

  userModel.checkUser();
  userModel.checkAuthorized();

  await userModel.comparePassword(password);

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your email");
  }

  const tokenUser = customUtils.createTokenUser(user);

  let refreshToken = "";

  const existingToken = user.Token;

  if (existingToken) {
    const { isValid } = existingToken;

    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Not authenticated");
    }
    refreshToken = existingToken.refreshToken;
    const { accessTokenJWT, refreshTokenJWT } = customUtils.getJWTToken({
      user: tokenUser,
      refreshToken,
    });

    return res.status(StatusCodes.OK).json({
      accessToken: accessTokenJWT,
      refreshToken: refreshTokenJWT,
      userId: user.id,
    });
  }

  refreshToken = customUtils.createRandomBytes();
  const userAgent = customUtils.getUserAgent(req);
  const ip = customUtils.getRequestIp(req);

  await prisma.token.create({
    data: {
      refreshToken,
      ip,
      userAgent,
      userId: user.id,
    },
  });

  const { accessTokenJWT, refreshTokenJWT } = customUtils.getJWTToken({
    user: tokenUser,
    refreshToken,
  });

  res.status(StatusCodes.OK).json({
    accessToken: accessTokenJWT,
    refreshToken: refreshTokenJWT,
    userId: user.id,
  });
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      Token: true,
    },
  });

  if (!user) {
    throw new CustomError.NotFoundError(
      `${email} does not exist, please register`
    );
  }

  const userModel = new modelMethods.User(user);

  userModel.checkAdmin();
  userModel.checkAuthorized();

  await userModel.comparePassword(password);

  if (!user.isVerified) {
    throw new CustomError.UnauthenticatedError("Please verify your email");
  }

  const tokenUser = customUtils.createTokenUser(user);

  let refreshToken = "";

  const existingToken = user.Token;

  if (existingToken) {
    const { isValid } = existingToken;

    if (!isValid) {
      throw new CustomError.UnauthenticatedError("Not authenticated");
    }
    refreshToken = existingToken.refreshToken;
    const { accessTokenJWT, refreshTokenJWT } = customUtils.getJWTToken({
      user: tokenUser,
      refreshToken,
    });

    return res.status(StatusCodes.OK).json({
      accessToken: accessTokenJWT,
      refreshToken: refreshTokenJWT,
      userId: user.id,
    });
  }

  refreshToken = customUtils.createRandomBytes();
  const userAgent = customUtils.getUserAgent(req);
  const ip = customUtils.getRequestIp(req);

  await prisma.token.create({
    data: {
      refreshToken,
      ip,
      userAgent,
      userId: user.id,
    },
  });

  const { accessTokenJWT, refreshTokenJWT } = customUtils.getJWTToken({
    user: tokenUser,
    refreshToken,
  });

  res.status(StatusCodes.OK).json({
    accessToken: accessTokenJWT,
    refreshToken: refreshTokenJWT,
    userId: user.id,
  });
};

const logout = async (req, res) => {
  await prisma.token.delete({
    where: {
      userId: req.user.userId,
    },
  });

  res.status(StatusCodes.OK).json({});
};

module.exports = {
  register,
  login,
  verify,
  forgotPassword,
  resetPassword,
  logout,
  adminLogin,
  adminRegister,
};
