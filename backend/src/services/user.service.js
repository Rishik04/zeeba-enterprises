import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../model/user.js";
import Auth from "../auth/auth.js";

export const adminRegister = async (payload) => {
  const { email, password, phone, name } = payload;

  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await UserModel.create({
    email,
    password: hashedPassword,
    name,
    phone,
  });

  return {
    message: "Admin registered successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};

export const adminLogin = async (payload) => {
  const { email, password } = payload;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("No user found with this email");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = Auth.generateAccessToken({
    email,
    name: user.name,
    id: user._id,
  });

  return {
    message: "Login successful",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  };
};
