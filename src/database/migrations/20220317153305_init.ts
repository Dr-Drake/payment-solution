import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user', (table: Knex.CreateTableBuilder)=>{
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.integer('phone_number').notNullable().unique().checkPositive();
        table.string('last_name').notNullable();
        table.string('first_name').notNullable();
        table.timestamps(true, true);
    })
    .createTable('account', (table: Knex.CreateTableBuilder)=>{
        table.increments('id').primary();
        table.integer('account_number').notNullable().unique().checkLength('>=', 10);
        table.double('balance', 2).notNullable().defaultTo(0);
        table.integer('user_id').references('user.id');
        table.integer('user_email').references('user.email');
        table.integer('user_phone_number').references('user.phone_number');
        table.integer('account_pin').notNullable().checkPositive().checkLength('=', 4);
        table.timestamps(true, true);
    })
    .createTable('transaction', (table: Knex.CreateTableBuilder)=>{
        table.increments('id').primary();
        table.integer('account_credited').notNullable().checkLength('>=', 10);
        table.integer('account_debited').notNullable().checkLength('>=', 10);
        table.double('amount', 2).notNullable();
        table.string('comments');

        /**
         * Since this is mysql, the uuid feature is not supported
         * Although version 8 of mysql has a UUID function, I will just allow
         * the client code to generate it (in support of earlier versions)
         */
        table.uuid('reference').notNullable().unique();
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user')
    .dropTable('account')
    .dropTable('transaction');
}

