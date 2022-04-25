import 'reflect-metadata';

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'docker',
  database: 'apivendas',
  synchronize: true,
  logging: true,
  entities: ['src/modules/**/typeorm/entities/*.ts'],
  subscribers: [],
  migrations: ['./src/shared/typeorm/migrations/*.ts'],
});

AppDataSource.initialize()
  .then(() => {
    // here you can start to work with your database
  })
  .catch(error => console.log(error));
