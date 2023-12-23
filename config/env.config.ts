import { config } from 'dotenv';
import { cleanEnv, str } from 'envalid';
config();

export const env = cleanEnv(process.env, {
  JWT_ACCESS_SECRET: str(),
  JWT_REFRESH_SECRET: str(),
});
