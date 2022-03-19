import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { AUTH_SERVICE, IAuthService } from "src/auth/interfaces/auth.interface";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    
    constructor( 
        @Inject(AUTH_SERVICE) private authService: IAuthService,  
    ) {
        super();
    }

    // Required in Passport strategy classes
    public async validate(email: string, password: string){
        return this.authService.validateUser(email, password);
    }
}