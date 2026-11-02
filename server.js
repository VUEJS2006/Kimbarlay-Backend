import express from "express";
import cors from "cors";
import "dotenv/config"


// Router
import townshipRouter from "./router/townshipRouter.js"
import translationRouter from "./router/translationsRouter.js";
import domesticHotelRouter from "./router/domesticHotelRouter.js";
import overseaHotelRouter from "./router/overseaHotelRouter.js";
import countryRouter from "./router/countryRouter.js"
import promotionHotelRouter from "./router/promotionHotelRouter.js";
import githubWebhookRouter from "./router/deployRouter.js";
import path from "path";
import airportRouter from "./router/airportRouter.js";
import airlineRouter from "./router/airlineRouter.js";
import routeRouter from "./router/routeRouter.js";
import flightRouter from "./router/flightRouter.js";
import bannerRouter from "./router/bannerRouter.js";
import expressReportCategoriesRouter from "./router/expressReportCategoryRouter.js";
import expressReportItemsRouter from "./router/expressReportItemRouter.js";
import cookieParser from "cookie-parser";
import authRouter from "./router/authRouter.js"
import trustCardsRouter from "./router/trustCardsRouter.js";
import bookingRouter from "./router/bookingRouter.js";
import faqsRouter from "./router/faqsRouter.js";
import guideTouter from "./router/hotelGuideRouter.js"
import guideRouter from "./router/guideRouter.js"
import reviewRouter from "./router/reviewRouter.js"
import rescheduleRequestRouter from "./router/rescheduleRequestRouter.js";
import refundRequestRouter from "./router/refundRequestRouter.js";
import helpfulRouter from "./router/helpfulRouter.js";
import domesticBookingRouter from "./router/domesticBookingRouter.js";
import overseaBookingRouter from "./router/overseaBookingRouter.js";
import allReviewRouter from "./router/allReviewRouter.js"
import tourBannerRouter from "./router/TravelRouter/tourBannerRouter.js"
import tourSectionRouter from "./router/TravelRouter/tourSectionRouter.js"
import domesticSectionRouter from "./router/TravelRouter/domesticSectionRouter.js"
import localSectionRouter from "./router/TravelRouter/localSectionRouter.js"
import tourDestinationRouter from "./router/TravelRouter/toueDestinationRouter.js"
import tourdepartRouter from "./router/TravelRouter/tourdepartRouter.js"
import tourPackageRouter from "./router/TravelRouter/tourPackageRouter.js"
import tourBookingRouter from "./router/TravelRouter/tourBookingRouter.js"
import tourDomesticRouter from "./router/TravelRouter/toueDomesticRouter.js"
import tourLocalRouter from "./router/TravelRouter/toueLocalRouter.js"
import tourDomesticPackageRouter from "./router/TravelRouter/tourDomesticPackageRouter.js"
import tourLocalPackageRouter from "./router/TravelRouter/tourLocalPackageRouter.js"
import tourDomesticBookingRouter from "./router/TravelRouter/tourDomesticBookingRouter.js"
import tourLocalBookingRouter from "./router/TravelRouter/tourLocalBookingRouter.js"
import newfeedRouter from "./router/TravelRouter/newfeedRouter.js";
import internationalRouter from "./router/TravelRouter/internationalDestinationRouter.js";
import internationalPackageRouter from "./router/TravelRouter/internationalPackageRouter.js";
import internationalBookingRouter from "./router/TravelRouter/interBookingRouter.js";

import specialOffersAndDealsRouter from "./router/TravelRouter/specialOffersAndDealsRouter.js";
import travelGroupOnBannerRouter from "./router/TravelRouter/travelGroupOnBannerRouter.js";
import travelBannerImageRouter from "./router/TravelRouter/travelBannerImageRouter.js";
import travelTestimonialRouter from "./router/TravelRouter/travelTestimonialRouter.js";
import tourismTourPackageRouter from "./router/TravelRouter/tourismTourPackageRouter.js";
import tourismTourBookingRouter from "./router/TravelRouter/tourismTourBookingRouter.js";




const app = express();


// for image
app.use(
    "/images",
    express.static(
        path.join(process.cwd(), "images")
    )
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.use('/api', townshipRouter)
app.use("/api", translationRouter)
app.use("/api", domesticHotelRouter)
app.use("/api", overseaHotelRouter)
app.use("/api", countryRouter)
app.use("/api", promotionHotelRouter)
app.use("/api", airportRouter)
app.use("/api", airlineRouter)
app.use("/api", routeRouter)
app.use("/api", flightRouter)
app.use("/api", bannerRouter)
app.use("/api", expressReportCategoriesRouter)
app.use("/api", expressReportItemsRouter)
app.use("/api", authRouter)
app.use("/api", trustCardsRouter)
app.use("/api", bookingRouter)
app.use("/api", faqsRouter)
app.use("/api", guideTouter)
app.use("/api", guideRouter)
app.use("/api", reviewRouter)
app.use("/api", reviewRouter)
app.use("/api", helpfulRouter)
app.use("/api", domesticBookingRouter)
app.use("/api", overseaBookingRouter)
app.use("/api", allReviewRouter)
app.use("/api", rescheduleRequestRouter)
app.use("/api", refundRequestRouter)
app.use("/api", tourBannerRouter)
app.use("/api", tourSectionRouter)
app.use("/api", domesticSectionRouter)
app.use("/api", localSectionRouter)
app.use("/api", tourDestinationRouter)
app.use("/api", tourdepartRouter)
app.use("/api", tourPackageRouter)
app.use("/api", tourBookingRouter)
app.use("/api", tourDomesticRouter)
app.use("/api", tourLocalRouter)
app.use("/api", tourDomesticPackageRouter)
app.use("/api", tourLocalPackageRouter)
app.use("/api", tourDomesticBookingRouter)
app.use("/api", tourLocalBookingRouter)
app.use("/api", newfeedRouter)
app.use("/api", internationalRouter)
app.use("/api", internationalPackageRouter)
app.use("/api", internationalBookingRouter)


app.use("/api", specialOffersAndDealsRouter)
app.use("/api", travelGroupOnBannerRouter)

app.use("/api", travelBannerImageRouter)
app.use("/api", travelTestimonialRouter)
app.use("/api", tourismTourPackageRouter)
app.use("/api", tourismTourBookingRouter)


app.get("/", (req, res) => {
    res.send("Welcome from Express. Nice to meet you");
});



// this route is not for frontend and just for auto deploy in name cheap
// plsease, don't  change or delete anything
// GitHub Webhook
app.use('/deploy', githubWebhookRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is Running on ${PORT}`)
})
