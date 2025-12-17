// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import multer from "multer";
// import https from "https";
// import fs from "fs";
// import path from "path";
// import AWS from "aws-sdk";
// import { generateSignedUrl } from "./cloudfrontSignedUrl.js";
// import { apiKeyAuth } from "./apiKeyAuth.js";

// const app = express();

// // ----------------------------
// //  MIDDLEWARE
// // ----------------------------
// app.use(express.json());

// // CORS (supports multiple origins from .env)
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }

//   res.header("Access-Control-Allow-Headers", "Content-Type, x-api-key");
//   res.header("Access-Control-Allow-Methods", "GET, POST");
//   next();
// });

// // ----------------------------
// //  AWS CONFIG
// // ----------------------------
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// // Multer → 25MB memory storage
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 25 * 1024 * 1024 },
// });

// // ----------------------------
// //  UPLOAD FILE → S3 + SHORT-LIVED SIGNED URL
// // ----------------------------
// app.post("/upload", apiKeyAuth, upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const file = req.file;

//     const params = {
//       Bucket: process.env.AWS_BUCKET,
//       Key: file.originalname,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     const uploadResult = await s3.upload(params).promise();

//     const signedUrl = generateSignedUrl(file.originalname);

//     res.json({
//       message: "File uploaded successfully",
//       fileKey: file.originalname,
//       mime: file.mimetype,
//       sizeKB: Math.round(file.size / 1024),
//       signedUrl,
//       expiresIn: "60 seconds",
//       s3Url: uploadResult.Location,
//     });

//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ error: "Failed to upload file" });
//   }
// });

// // ----------------------------
// //  GET NEW SHORT-LIVED SIGNED URL (SECURED)
// // ----------------------------
// app.get("/get-url/:key", apiKeyAuth, (req, res) => {
//   try {
//     const fileKey = req.params.key;

//     if (!fileKey) {
//       return res.status(400).json({ error: "Missing file key" });
//     }

//     const signedUrl = generateSignedUrl(fileKey);

//     res.json({
//       fileKey,
//       signedUrl,
//       expiresIn: "60 seconds",
//     });

//   } catch (error) {
//     console.error("Signed URL Error:", error);
//     res.status(500).json({ error: "Failed to generate URL" });
//   }
// });

// // ----------------------------
// //  HTTPS SERVER
// // ----------------------------
// const __dirname = path.resolve();

// const options = {
//   key: fs.readFileSync(path.join(__dirname, "certs", "backend-key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "certs", "backend.pem")),
// };

// https.createServer(options, app).listen(process.env.PORT, () => {
//   console.log(`HTTPS Server running at https://localhost:${process.env.PORT}`);
// });

// import dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// import multer from "multer";
// import https from "https";
// import fs from "fs";
// import path from "path";
// import AWS from "aws-sdk";
// import { generateSignedUrl } from "./cloudfrontSignedUrl.js";
// import { apiKeyAuth } from "./apiKeyAuth.js";

// const app = express();

// // ----------------------------
// //  MIDDLEWARE
// // ----------------------------
// app.use(express.json());

// // CORS (supports multiple origins from .env)
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (allowedOrigins.includes(origin)) {
//     res.header("Access-Control-Allow-Origin", origin);
//   }

//   res.header("Access-Control-Allow-Headers", "Content-Type, x-api-key");
//   res.header("Access-Control-Allow-Methods", "GET, POST");
//   next();
// });

// // ----------------------------
// //  AWS CONFIG
// // ----------------------------
// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// // Multer → 25MB memory storage
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 25 * 1024 * 1024 },
// });

// // ----------------------------
// //  UPLOAD FILE → S3 + SHORT-LIVED SIGNED URL
// // ----------------------------
// app.post("/upload", apiKeyAuth, upload.single("file"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });

//     const file = req.file;

//     const params = {
//       Bucket: process.env.AWS_BUCKET,
//       Key: file.originalname,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//     };

//     const uploadResult = await s3.upload(params).promise();

//     const signedUrl = generateSignedUrl(file.originalname);

//     res.json({
//       message: "File uploaded successfully",
//       fileKey: file.originalname,
//       mime: file.mimetype,
//       sizeKB: Math.round(file.size / 1024),
//       signedUrl,
//       expiresIn: "60 seconds",
//       s3Url: uploadResult.Location,
//     });

//   } catch (error) {
//     console.error("Upload Error:", error);
//     res.status(500).json({ error: "Failed to upload file" });
//   }
// });

// // ----------------------------
// //  GET NEW SHORT-LIVED SIGNED URL (SECURED)
// // ----------------------------
// app.get("/get-url/:key", apiKeyAuth, (req, res) => {
//   try {
//     const fileKey = req.params.key;

//     if (!fileKey) {
//       return res.status(400).json({ error: "Missing file key" });
//     }

//     const signedUrl = generateSignedUrl(fileKey);

//     res.json({
//       fileKey,
//       signedUrl,
//       expiresIn: "60 seconds",
//     });

//   } catch (error) {
//     console.error("Signed URL Error:", error);
//     res.status(500).json({ error: "Failed to generate URL" });
//   }
// });

// // ----------------------------
// //  HTTPS SERVER
// // ----------------------------
// const __dirname = path.resolve();

// const options = {
//   key: fs.readFileSync(path.join(__dirname, "certs", "backend-key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "certs", "backend.pem")),
// };

// https.createServer(options, app).listen(process.env.PORT, () => {
//   console.log(`HTTPS Server running at https://localhost:${process.env.PORT}`);
// });

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import AWS from "aws-sdk";
import cookieParser from "cookie-parser";
import { generateSignedCookies } from "./cloudfrontCookies.js";
import { apiKeyAuth } from "./apiKeyAuth.js";

const app = express();

// ----------------------------
//  MIDDLEWARE
// ----------------------------
app.use(express.json());
app.use(cookieParser());

// CORS (for browser testing)
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
//  AWS CONFIG (not used now but kept)
// ----------------------------
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// ----------------------------
//  ACCESS ENDPOINT
// ----------------------------
app.get("/access", (req, res) => {
  try {
    const { cookies, expiresAt } = generateSignedCookies({
      expiresInSeconds: 10 * 60, // 10 minutes
      resourcePath: "/*",
    });

    // ✅ SET SIGNED COOKIES
    Object.entries(cookies).forEach(([name, value]) => {
      res.cookie(name, value, {
        path: "/",
        httpOnly: true,
        secure: true,     // required for CloudFront
        sameSite: "None", // required for CDN cookies
      });
    });

    res.json({
      message: "Access granted. Signed cookies set.",
      expiresAt,
      testUrl: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/code.html`,
    });
  } catch (error) {
    console.error("Access Error:", error);
    res.status(500).json({ error: "Failed to grant access" });
  }
});

// ----------------------------
//  HTTP SERVER (IMPORTANT)
// ----------------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
