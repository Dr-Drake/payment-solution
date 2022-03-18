import { HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { User } from "../entities/user.entity";
import { IUserService } from "../interfaces/user.interfaace";
import userDb from "./user.data";

const mockUserService = {
    createUser: jest.fn().mockImplementation((request: CreateUserDto)=>{
        let user = new User();
        user.id = 3;
        user.email = request.email;
        user.first_name = request.first_name;
        user.last_name = request.last_name;
        user.password = request.password;
        user.phone_number = request.phone_number;
       let result = {
           ...userDb,
           ...user
       }

       return result;
    }),
        
    findAllUsers: jest.fn().mockImplementation(()=>{
        return userDb;
    }),

    findUserById: jest.fn().mockImplementation((id: number)=>{
        let user = userDb.find((u)=> u.id === id);
        if (!user) {
            Promise.resolve(new HttpException('Not Found', HttpStatus.NOT_FOUND));
        }
        else{
            return user;
        }
    }),

    findUserByEmail: jest.fn().mockImplementation((email: string)=>{
        let user = userDb.find((u)=> u.email === email);
        if (!user) {
            Promise.resolve(new HttpException('Not Found', HttpStatus.NOT_FOUND));
        }
        else{
            return user;
        }
    }),
    
    findUserByPhoneNumber: jest.fn().mockImplementation((phone_number: number)=>{
        let user = userDb.find((u)=> u.phone_number === phone_number );
        if (!user) {
            Promise.resolve(new HttpException('Not Found', HttpStatus.NOT_FOUND));
        }
        else{
            return user;
        }
    }),
    
}

export default mockUserService;