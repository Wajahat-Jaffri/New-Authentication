import crypto from "crypto";

const hashValue = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

export default hashValue;