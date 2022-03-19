import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectKnex, Knex } from 'nestjs-knex';
import { User } from 'src/user/entities/user.entity';
import { IAuthService } from './interfaces/auth.interface';
import { LoginResponse } from './interfaces/responses/LoginResponse';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService implements IAuthService {
    constructor(
        @Inject() private jwtService: JwtService,
        @InjectKnex() private readonly knex: Knex
    ){}

    public async validateUser(email: string, password: string): Promise<User> {
        // Search for user
        const user = await this.knex<User>('user').where('email', '=', email).first();

        if (user) {
            // validte password
            let match = await bcrypt.compare(password, user.password);

            if (match) {
                return user;
            }
            else{
                throw new UnauthorizedException('Incorrect password');
            }
        }
        else{
            throw new UnauthorizedException('User does not exist');
        }

    }
    
    public async login(user: User): Promise<LoginResponse> {
        
        let payload = { sub: user.id, email: user.email };
        let result: LoginResponse = {
            ...user,
            access_token: this.jwtService.sign(payload)
        }
        return result;
    }
}
