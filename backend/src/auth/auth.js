import jwt from "jsonwebtoken";
import * as env from "dotenv";
env.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const tokenFromHeader =
    authHeader && authHeader.split(" ")[0] === "Bearer"
      ? authHeader.split(" ")[1]
      : null;

  const token = tokenFromHeader;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = payload;
    next();
  });
};

const Auth = { generateAccessToken, authenticateToken };

export default Auth;
