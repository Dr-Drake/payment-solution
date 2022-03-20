import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_SERVICE } from './interfaces/auth.interface';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { LocalStrategy } from '../strategies/local.strategy';

@Module({
    imports:[
        UserModule, PassportModule, 
        JwtModule.register({
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '10h' }
        })
    ],
    controllers: [AuthController],
    providers: [
        { provide: AUTH_SERVICE, useClass: AuthService },
        JwtStrategy, LocalStrategy
    ],
    exports:[JwtStrategy, LocalStrategy, { provide: AUTH_SERVICE, useClass: AuthService }]
})
export class AuthModule {}
