import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cookieParser from "cookie-parser";
import { generateSignedCookies } from "./cloudfrontCookies.js";
import { apiKeyAuth } from "./apiKeyAuth.js";

const app = express();

// ----------------------------
//  MIDDLEWARE
// ----------------------------
app.use(express.json());
app.use(cookieParser());

// ----------------------------
//  CORS (ONLY IF YOU USE FRONTEND)
// ----------------------------
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  res.header("Access-Control-Allow-Methods", "GET");
  next();
});

// ----------------------------
//  ACCESS ENDPOINT (SECURED)
// ----------------------------
app.get("/access", apiKeyAuth, (req, res) => {
  try {
    const { cookies, expiresAt } = generateSignedCookies({
      expiresInSeconds: 10 * 60, // 10 minutes
      resourcePath: "/*",
    });

    const cookieOptions = {
      domain: .${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}, // ⭐ FIX
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    // ✅ SET SIGNED COOKIES FOR CLOUDFRONT
    Object.entries(cookies).forEach(([name, value]) => {
      res.cookie(name, value, cookieOptions);
    });

    // ✅ AUTO REDIRECT (BEST UX)
    return res.redirect(
      https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/code.html
    );

  } catch (error) {
    console.error("Access Error:", error);
    return res.status(500).json({ error: "Failed to grant access" });
  }
});

// ----------------------------
//  SERVER
// ----------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(✅ Server running on port ${PORT});
});
