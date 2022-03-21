import { Body, Controller, HttpCode, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { User } from '../user/entities/user.entity';
import { AUTH_SERVICE, IAuthService } from './interfaces/auth.interface';

@Controller('/api/v1/auth')
export class AuthController {

    constructor(
        @Inject(AUTH_SERVICE) private authService: IAuthService
    ){}

    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('login')
    public async login(@Request() req){
        let user: User = req.user;
        return await this.authService.login(user);
    }
}
