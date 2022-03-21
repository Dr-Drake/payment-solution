import { Knex } from "knex";
import { TransactionType } from "../../payment/enums/TransactionType";
import AccountType from "../../account/enums/AccountTypes";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user', (table: Knex.CreateTableBuilder)=>{
        table.increments('id').primary();
        table.string('email').notNullable().unique();
        table.string('password').notNullable();
        table.string('phone_number').notNullable().unique().checkPositive();
        table.string('last_name').notNullable();
        table.string('first_name').notNullable();
        table.timestamps(true, true);
    })
    .createTable('account', (table: Knex.CreateTableBuilder)=>{
        table.increments('id').primary();
        table.string('account_number', 10).notNullable().unique().checkLength('>=', 10);
        table.double('balance').notNullable().defaultTo(0);
        table.integer('user_id').unsigned();
        table.foreign('user_id').references('user.id').onDelete('cascade').onUpdate('cascade');
        table.string('user_email').references('user.email').onDelete('cascade').onUpdate('cascade').notNullable();
        table.string('user_phone_number').references('user.phone_number').onDelete('cascade').onUpdate('cascade').notNullable();
        table.integer('account_pin').nullable().checkPositive().checkLength('=', 4);
        table.enu('type', [AccountType.CURRENT, AccountType.SAVINGS]).notNullable();
        table.timestamps(true, true);
    })
    .createTable('intra_transaction', (table: Knex.CreateTableBuilder)=>{
        table.increments('id').primary();
        table.string('account_credited', 10).notNullable().checkLength('>=', 10);
        table.string('account_debited', 10).notNullable().checkLength('>=', 10);
        table.double('amount').notNullable();
        table.string('comments');

        /**
         * Since this is mysql, the uuid feature is not supported
         * Although version 8 of mysql has a UUID function, I will just allow
         * the client code to generate it (in support of earlier versions)
         */
        table.uuid('reference').notNullable().unique();
        table.timestamps(true, true);
    })
    .createTable('inter_transaction', (table: Knex.CreateTableBuilder)=>{
        table.increments('id').primary();
        table.string('account_number', 10).notNullable().checkLength('>=', 10);
        table.integer('type').notNullable();
        table.double('amount').notNullable();
        table.string('comments');
        table.uuid('reference').notNullable().unique();
        table.timestamps(true, true);
    })
    .createTable('transaction_history', (table: Knex.CreateTableBuilder)=>{
        table.increments('id').primary();
        table.string('user_email').references('user.email').onDelete('cascade').onUpdate('cascade').notNullable();
        table.string('account_number', 10).notNullable().checkLength('>=', 10);
        table.string('transaction_ref').notNullable();
        table.boolean('credit').notNullable();
        table.timestamps(true, true);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('account')
    .dropTable('transaction_history')
    .dropTable('user')
    .dropTable('intra_transaction')
    .dropTable('inter_transaction');
}

