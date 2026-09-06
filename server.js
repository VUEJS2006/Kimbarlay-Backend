import express from "express";
import cors from "cors";
import "dotenv/config"


// Router
import townshipRouter from "./router/townshipRouter.js"
const app = express();





app.use(cors())
app.use('api/', townshipRouter)
app.use("/", (req, res) => {
    res.send("Hello Kimberlay")
})



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`)
})