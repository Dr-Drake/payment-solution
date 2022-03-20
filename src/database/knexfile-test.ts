import { Knex } from "knex";

const config: Knex.Config  = {
    // Ideally should be in env variables
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
};
  
export default config;