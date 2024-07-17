const { User } = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.cookies.x_auth;
  try {
    const user = await User.findByToken(token);
    if (!user) {
      return res.status(401).json({ isAuth: false, error: true });
    }
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { auth };
