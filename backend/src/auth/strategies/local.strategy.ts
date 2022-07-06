import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/LoginDto.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(userCredentials: LoginDto): Promise<User> {
    const user = await this.authService.validateUser(userCredentials);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}