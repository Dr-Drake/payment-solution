import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AUTH_SERVICE } from './interfaces/auth.interface';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
    imports:[
        PassportModule, 
        UserModule,
        JwtModule.register({
            secret: 'WOWSECRETLOL', // should be in env
            signOptions: { expiresIn: '10h' }
        }),
    ],
    controllers: [AuthController],
    providers: [
        LocalStrategy,
        { provide: AUTH_SERVICE, useClass: AuthService },
    ],
    exports:[{ provide: AUTH_SERVICE, useClass: AuthService }]
})
export class AuthModule {}
