import express from "express";
import { adminRegister, adminLogin } from "../services/user.service.js";
import Auth from "../auth/auth.js";

const userRouter = express.Router();

userRouter.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ status: 400, message: "Email and password required" });
    }

    const result = await adminLogin({ email, password });

    res.status(200).json({
      status: 200,
      message: result.message,
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

userRouter.post("/admin-register", async (req, res) => {
  try {
    const { email, password, phone, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ status: 400, message: "Name, email and password required" });
    }

    const result = await adminRegister({ email, password, phone, name });

    res.status(201).json({
      status: 201,
      message: result.message,
      user: result.user,
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: error.message });
  }
});

userRouter.get("/auth/validate", Auth.authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

export default userRouter;
