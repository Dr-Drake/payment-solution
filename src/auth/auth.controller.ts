import { Body, Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { AUTH_SERVICE, IAuthService } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {

    constructor(
        @Inject(AUTH_SERVICE) private authService: IAuthService
    ){}

    @UseGuards(LocalAuthGuard)
    @Post('/login')
    public async login(@Request() req){
        let user: User = req.user;
        return await this.authService.login(user);
    }
}
