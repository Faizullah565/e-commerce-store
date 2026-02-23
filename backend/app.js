import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

// =========== CREATE AN EXPRESS APP =============
const app = express()

// ========= CONFIGURE DOTENV ===================
dotenv.config()

// ========= CORS ===============================
app.use(
  cors({
    origin: "https://e-commerce-store-orpin-eight.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json())

// =============== CONNECT TO DATABASE =====================
connectDB()

//============== IMPORT ROUTERS ===============
import userRouter from './routes/users.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import orderRouter from './routes/order.routes.js'
import fetchUser from './middleware/fetchUser.js'

// ============== API CALLS =====================
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
app.use(fetchUser)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

// ============== TEST ROUTES ===================
app.get("/", (req, res) => {
  res.send("Hello from Backend!")
})

app.get("/api/test", (req, res) => {
  res.json({ ok: true })
})


export default app




// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`)
// })