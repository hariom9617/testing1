import fs from "fs";
import path from "path";
import crypto from "crypto";

export function generateSignedUrl(filePath) {
  const privateKeyPath = path.resolve(process.env.PRIVATE_KEY_PATH);
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");

  const resource = `https://${process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN}/${filePath}`;
  // const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const expires = Math.floor(Date.now() / 1000) + 60; // 1 minute

  // Policy JSON
  const policy = JSON.stringify({
    Statement: [
      {
        Resource: resource,
        Condition: {
          DateLessThan: { "AWS:EpochTime": expires }
        }
      }
    ]
  });

  // Base64 encode policy
  const policyBase64 = Buffer.from(policy).toString("base64");

  // URL-encode the base64 (CLOUD FRONT REQUIRES THIS)
  const encodedPolicy = encodeURIComponent(policyBase64);

  // Create signature (base64)
  const signatureBase64 = crypto
    .createSign("RSA-SHA1")
    .update(policy)
    .sign(privateKey, "base64");

  // URL-encode the signature
  const encodedSignature = encodeURIComponent(signatureBase64);

  return `${resource}?Policy=${encodedPolicy}&Signature=${encodedSignature}&Key-Pair-Id=${process.env.CLOUDFRONT_KEY_PAIR_ID}`;
}
