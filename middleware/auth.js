// const { User } = require("../models/User");

// const auth = async (req, res, next) => {
//   const token = req.cookies.x_auth;
//   console.log("토큰:", token);
//   try {
//     const user = await User.findByToken(token);
//     if (!user) {
//       return res.status(401).json({ isAuth: false, error: true });
//     }
//     req.token = token;
//     req.user = user;
//     console.log("인증된 사용자:", user);
//     next();
//   } catch (err) {
//     console.error("인증 중 오류 발생:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = { auth };

const { User } = require("../models/User");

const auth = async (req, res, next) => {
  const token = req.cookies.x_auth || req.headers.authorization?.split(" ")[1];
  console.log("토큰:", token);
  try {
    const user = await User.findByToken(token);
    if (!user) {
      console.error("사용자를 찾을 수 없습니다.");
      return res.status(401).json({ isAuth: false, error: true });
    }
    req.token = token;
    req.user = user;
    console.log("인증된 사용자:", user);
    next();
  } catch (err) {
    console.error("인증 중 오류 발생:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { auth };
