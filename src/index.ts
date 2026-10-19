import dns from "dns";

// Force Node.js to use Google Public DNS for SRV queries
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import dotenv from 'dotenv'
import cors from "cors";
import { connectDB } from "./config/database.js";
import { setupSwagger } from "./config/swagger.js";
import userRoutes from "./routes/userRoute.js";
import ProgramRoutes from "./routes/programRoute.js";
import ImpactRoutes from "./routes/impactRoute.js";
import storyRoute from "./routes/storyRoute.js";
import staffRoute from "./routes/staffRoute.js";
import galleryRoute from "./routes/galleryRoute.js" ;
import donateRoute from "./routes/donateRoute.js";
import DonationTransactionRoute from "./routes/donationTransactionRoute.js";
import fitTestRoute from "./routes/fitTestRoute.js";
import homeImageRoute from "./routes/homeImageRoute.js";
import donorMessageRoute from "./routes/donorMessageRoute.js";
import partnershipRoute from "./routes/partnershipRoute.js";
import { apiLimiter } from "./middleware/rateLimiter.js";


dotenv.config();
const app = express();
app.use(cors());

app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app)


app.use("/api/", apiLimiter);

app.use('/api/users', userRoutes);
app.use('/api/programs', ProgramRoutes);
app.use('/api/impacts', ImpactRoutes);
app.use("/api/stories", storyRoute);
app.use("/api/staff", staffRoute)
app.use("/api/gallery", galleryRoute)
app.use("/api/donate", donateRoute);
app.use("/api/donations", DonationTransactionRoute);
app.use("/api/fit-test", fitTestRoute);
app.use("/api/donor-message", donorMessageRoute);
app.use("/api/home-images", homeImageRoute);
app.use("/api/partnerships", partnershipRoute);


const port = process.env.PORT || 4006;

// Start server ONLY after establishing database connection
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connection established successfully.");

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database. Server not started.", error);
    process.exit(1);
  }
};

startServer();