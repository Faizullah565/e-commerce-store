import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
// =========== CREATE AN EXPRESS APP =============
const app = express()
// ========= CONFIGURE DOTENV ===================
dotenv.config()

app.use(cors({origin:"https://e-commerce-store-orpin-eight.vercel.app/"}))
app.use(express.json())
// =========== IMPORT PORT FRON .ENV FILE ==============
const port = process.env.PORT
// =============== CONNECT TO DATABASE =====================
connectDB()

// app.use(express.raw({extended : false}))

//============== IMPORT ROUTERS ===============
import userRouter from './routes/users.routes.js'
import productRouter from './routes/products.routes.js'
import cartRouter from './routes/carts.routes.js'
import orderRouter from './routes/order.routes.js'
import fetchUser from './middleware/fetchUser.js'

// ============== API CALLS =====================
app.use("/api/users", userRouter)
app.use("/api/products", productRouter)
// ================ MIDDLEWARE AUTHENTICATION ============================
app.use(fetchUser)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.get("/", (req, res)=>{
  res.send("Hello")
})
// =========== APP LISTEN ==============
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
