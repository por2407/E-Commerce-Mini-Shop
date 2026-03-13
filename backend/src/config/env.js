import dotenv from 'dotenv';

dotenv.config();

export const cfg = {
    port : process.env.PORT,
    mongoUri : process.env.MONGO_URI,
    jwtSecret : process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV || "development",
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:4200"
}