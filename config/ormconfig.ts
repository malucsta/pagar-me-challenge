import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  port: Number(process.env.db_port),
  database: process.env.db_name,
  username: process.env.db_user,
  password: process.env.db_pass,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: ['dist/src/db/typeorm/migrations/**/*.js'],
};

export default config;
