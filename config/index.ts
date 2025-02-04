import { resolve } from 'node:path';
import process from 'node:process';
import { config } from 'dotenv';

const dotenv = config({ path: resolve(process.cwd().concat('/.env')) });

export const app = {
  name: 'tasklistapp',
};

export const db = {
  name: dotenv.parsed?.DB_NAME,
  host: dotenv.parsed?.DB_HOST,
  port: Number(dotenv.parsed?.DB_PORT),
  user: dotenv.parsed?.DB_USER,
  password: dotenv.parsed?.DB_PASSWORD,
};

export const cache = {
  host: dotenv.parsed?.REDIS_HOST,
  port: Number(dotenv.parsed?.REDIS_PORT),
  expiry: Number(dotenv.parsed?.REDIS_EXPIRE),
  password: dotenv.parsed?.REDIS_PASSWORD,
};
