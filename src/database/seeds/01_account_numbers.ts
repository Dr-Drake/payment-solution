import { Knex } from "knex";
import { AccountNumberEntity } from "../../account/entities/account.entity";
import generateAccountNo from "../../utils/generateAccountNo";

export async function seed(knex: Knex): Promise<void> {

    // Insert 10000 unique account numbers into the database
    for (let i = 0; i < 10000; i++) {
        
        // Generate account number
        let account_number = generateAccountNo();

        // Make sure its unique by checking for collision
        while ( await knex<AccountNumberEntity>('account_numbers').where('unique_number', '=', account_number).first()) {
            account_number = generateAccountNo();
        }

        // Insert account number into
        let accountRecord = new AccountNumberEntity();
        accountRecord.unique_number = account_number;
        await knex<AccountNumberEntity>('account_numbers').insert(accountRecord);
    }

};
