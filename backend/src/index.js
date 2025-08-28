import express from "express"
import dotenv from "dotenv"
import {connectDB} from "./lib/db.js"

import authRoutes from "./routes/auth.routes.js"
import messageRoutes from "./routes/message.routes.js"

dotenv.config()
const PORT = process.env.PORT

const app = express();
app.use(express.json());


app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

app.listen(PORT, ()=>{
    console.log("server is running on port "+PORT)
    connectDB();
})