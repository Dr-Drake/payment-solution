import type { Knex } from "knex";

// Update with your config settings.

//TODO
// Change staging and production

export const TEST_CONNECTION = 'TEST_CONNECTION';
export const DEV_CONNECTION = 'DEV_CONNECTION';

const config: { [key: string]: Knex.Config } = {
  // Ideally should be in env variables
  development: {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'payment',
      password : 'password',
      database : 'payment_monolith'
    },
    pool:{
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    seeds: {
      directory: './seeds'
    }
  },

  testing:{
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      port : 3306,
      user : 'payment',
      password : 'password',
      database : 'payment_monolith_test'
    },
    pool:{
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    },
    seeds: {
      directory: './seeds'
    }
  }
};

export default config;
