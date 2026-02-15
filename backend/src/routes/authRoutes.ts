import express from "express";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const router = express.Router();

//Register Route
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Step 1 - Check if the user already exists find the email in the database
    const existingUser = await User.findOne({ email });

    //Step 2 - If exists return an error message that user already exists.
    if (existingUser) {
      return res.status(400).json({ message: "already a user!" });
    }

    //Step 3 - If not exists, hash the password for security purposes.
    const hashedPassword = await bycrypt.hash(password, 10);

    //Step 4 - Create and store the new user in the database with the hashed password.
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    //Step 5 - Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    // Step 5 - Return the token (for future requests) and user information excluding the password to the client.
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
});

//Login authentication route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //Step 1 - Check if the user exists or not.
    const user = await User.findOne({ email });

    //Step 2 - If not, then return error, that user does not exists or invalid credentials.
    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    //Step 3 - If the email exists, then match the password.
    const isPasswordValid = await bycrypt.compare(password, user.password);

    //Step 4 - If the password does not matches then return error, invalid password
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    // Step 5 - If exists, create the token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    //Step 6 - return the token and user data to the client
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "something gone wrong!" });
  }
});

export default router;
