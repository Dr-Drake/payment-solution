import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('account_numbers', (table: Knex.CreateTableBuilder)=>{
        table.increments('id');
        table.string('unique_number', 10).unique().notNullable();
        table.boolean('used').defaultTo(false);
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('account_numbers');
}

