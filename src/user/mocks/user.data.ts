import { User } from "../entities/user.entity";

const userDb: User[] = [
    {
        id: 1,  email: 'ikem.ezechukwu@mail.com', 
        password: 'ehhejhje', phone_number: '09059002043',
        first_name: 'Ikem', last_name: 'Ezechukwu'  
    },
    {
        id: 2,  email: 'john.doe@mail.com', 
        password: 'ehhejhje', phone_number: '09359002143',
        first_name: 'John', last_name: 'Doe'  
    },
]

export default userDb;