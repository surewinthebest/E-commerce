import dotenv from "dotenv";

dotenv.config({ quiet: true });

const PORT_default = 3000;

export const ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? process.env.PORT : PORT_default,
    DB_URL: process.env.DB_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    INNGEST_SECRET_KEY: process.env.INNGEST_SECRET_KEY,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    CLIENT_URL: process.env.CLIENT_URL,
}