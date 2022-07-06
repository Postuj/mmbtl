import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/LoginDto.dto';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/RegisterDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(userCredentials: LoginDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(userCredentials.email);
    if (!user) return null;

    // const isPasswordMatching = await bcrypt.compare(
    //   userCredentials.password,
    //   user.password,
    // );

    const { password, ...result } = user;
    return result;

    // return isPasswordMatching ? user : null;
  }

  async validateUserJwt(username: string, id: number): Promise<any> {
    const user = await this.usersService.findOneById(id);
    if (!user) return null;

    const { password, ...result } = user;
    return result;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signUpLocal(userCredentials: RegisterDto) {
    // ToDo: Change to findOneByEmailOrUsername
    // const user = await this.usersService.findOneByEmailOrUsername(userCredentials.email);
    const user = await this.usersService.findOneByEmail(userCredentials.email);
    if (user)
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User with this email or username already exists',
        },
        HttpStatus.FORBIDDEN,
      );
    // ToDo: Move hash to client
    const password = await bcrypt.hash(userCredentials.password, 12);

    const newUser = await this.usersService.createUser({
      ...userCredentials,
      password,
    });

    return this.login(newUser);
  }
}
