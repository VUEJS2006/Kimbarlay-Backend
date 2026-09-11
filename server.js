import express from "express";
import cors from "cors";
import "dotenv/config"


// Router
import townshipRouter from "./router/townshipRouter.js"
import translationRouter from "./router/translationsRouter.js";
import domesticHotelRouter from "./router/domesticHotelRouter.js";
import countryRouter from "./router/countryRouter.js"
import promotionHotelRouter from "./router/promotionHotelRouter.js";


const app = express();




app.use(express.json())
app.use(cors())
app.use('/api', townshipRouter)
app.use("/api", translationRouter)
app.use("/api", domesticHotelRouter)
app.use("/api", countryRouter)
app.use("/api", promotionHotelRouter)

app.get("/", (req, res) => {
    res.send("/ - EXPRESS");
});

app.get("/test", (req, res) => {
    res.send("/TEST - EXPRESS");
});

app.use("/use", (req, res) => {
    res.send("/Use - EXPRESS");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT,"0.0.0.0", () => {
    console.log(`Server is Running on ${PORT}`)
})