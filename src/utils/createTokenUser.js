const createTokenUser = (user) => {
  return { userId: user.id, role: user.role };
};

module.exports = { createTokenUser };
