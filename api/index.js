import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Load env FIRST
dotenv.config();

import connectDB from "../backend/config/db.js";

// =========== CREATE EXPRESS APP =============
const app = express();

// =========== MIDDLEWARE =====================

// Better CORS (local + production)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://e-commerce-store-orpin-eight.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: "10mb" }));

// =============== CONNECT TO DATABASE =====================
// Prevent multiple connections in serverless
let isConnected = false;

const connectDatabase = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

await connectDatabase();

// ============== IMPORT ROUTERS ===========================
import userRouter from "../backend/routes/users.routes.js";
import productRouter from "../backend/routes/products.routes.js";
import cartRouter from "../backend/routes/carts.routes.js";
import orderRouter from "../backend/routes/order.routes.js";
import fetchUser from "../backend/middleware/fetchUser.js";

// ============== API ROUTES ===============================
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use(fetchUser);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ============== TEST ROUTES ===============================
app.get("/", (req, res) => {
  res.send("Hello from Backend!");
});

app.get("/api/test", (req, res) => {
  res.send("Hello Test");
});

//IMPORTANT FOR VERCEL
export default app;