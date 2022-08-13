import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const source = new DataSource({
  type: 'postgres',
  port: Number(process.env.db_port),
  database: process.env.db_name,
  username: process.env.db_user,
  password: process.env.db_pass,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/src/db/typeorm/migrations/**/*.js'],
});

export default source;
