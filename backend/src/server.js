import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";
import router from "./routes/admin.route.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

const __dirname = path.resolve();

app.use(express.json);
app.use(clerkMiddleware()); //adds auth object under the req => req.auth

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/admin", router);

app.get("/api/health", (req, res) => {
    res.status(200).json({ "message": "Sucess" })
})

//make the app ready for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")))

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"))
    })
}

const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("server is up and running");
    })
};

startServer();


