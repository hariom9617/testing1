// import fs from "fs";
// import path from "path";
// import crypto from "crypto";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export function generateSignedCookies() {
//   const privateKeyPath = process.env.PRIVATE_KEY_PATH;
//   const privateKey = fs.readFileSync(path.resolve(privateKeyPath), "utf8");

//   const policy = JSON.stringify({
//     Statement: [
//       {
//         Resource: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/*`,
//         Condition: {
//           DateLessThan: { "AWS:EpochTime": Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 }
//         }
//       }
//     ]
//   });

//   const signature = crypto
//     .createSign("RSA-SHA1")
//     .update(policy)
//     .sign(privateKey, "base64");

//   return {
//     "CloudFront-Policy": Buffer.from(policy).toString("base64"),
//     "CloudFront-Signature": signature,
//     "CloudFront-Key-Pair-Id": process.env.CLOUDFRONT_KEY_PAIR_ID
//   };
// }


import fs from "fs";
import path from "path";
import crypto from "crypto";

export function generateSignedCookies({
  expiresInSeconds = 10 * 60, // 10 minutes
  resourcePath = "/*"
}) {
  const privateKeyPath = path.resolve(process.env.PRIVATE_KEY_PATH);
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;

  const policy = JSON.stringify({
    Statement: [
      {
        Resource: `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}${resourcePath}`,
        Condition: {
          DateLessThan: {
            "AWS:EpochTime": expiresAt
          }
        }
      }
    ]
  });

  const signature = crypto
    .createSign("RSA-SHA1")
    .update(policy)
    .sign(privateKey, "base64");

  return {
    cookies: {
      "CloudFront-Policy": Buffer.from(policy).toString("base64"),
      "CloudFront-Signature": signature,
      "CloudFront-Key-Pair-Id": process.env.CLOUDFRONT_KEY_PAIR_ID
    },
    expiresAt
  };
}
