import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '/migrations/*{.ts,.js}')],
  subscribers: [],
  extra: {
    connectionTimeoutMillis: 60000,
    query_timeout: 60000,
    statement_timeout: 60000,
  },
});
