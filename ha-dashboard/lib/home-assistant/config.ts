const haUrl = process.env.HA_URL;
const haToken = process.env.HA_TOKEN;

if (!haUrl || !haToken) {
  throw new Error("HA_URL and HA_TOKEN must be defined in .env.local");
}

export const haConfig = {
  url: haUrl,
  token: haToken
};