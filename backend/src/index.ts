import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import inventoryRoutes from "./routes/inventoryRoutes";
import shoppingRoutes from "./routes/shoppingRoutes";
import path from "path";

console.log("SERVER FILE STARTED");

dotenv.config();

connectDB(); //Connect to MongoDB

const app = express();

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

//Middleware
app.use(cors()); //help in communicating to frontend which runs on a different port.
app.use(express.json()); //help in reading the json data sent by frontend.

//Routes
//For auth, it is a base url for all the auth related routes, which are defined in authRoutes.ts file. So, for example, the register route will be accessed at /api/auth/register and login route will be accessed at /api/auth/login
app.use("/api/auth", authRoutes);

//Route for inventory related operations.
app.use("/api/inventory", inventoryRoutes);

//Shopping Routes for shopping list related operations.
app.use("/api/shopping", shoppingRoutes);

// 🔥 SPA fallback (MUST be last)
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// test route
app.get("/", (req, res) => {
  res.json({ message: "Pantry App is running" });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
