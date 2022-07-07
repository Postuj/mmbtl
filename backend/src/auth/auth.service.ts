import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { RegisterDto } from './dto/RegisterDto';
import { UserData } from 'src/users/interfaces/userData.interface';
import { RefreshTokenDto } from './dto/RefreshTokenDto.dto';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  private readonly salt: number = parseInt(process.env.SALT);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<UserData> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) return null;

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    return isPasswordMatching ? user.toUserData() : null;
  }

  async validateUserJwt(userId: number): Promise<UserData> {
    const user = await this.usersService.findOneById(userId);
    if (!user) return null;

    return user.toUserData();
  }

  async validateUserRefreshTokenJwt(
    userId: number,
    providedRefreshToken: string,
  ) {
    const user = await this.usersService.findOneById(userId);
    if (!user || !user.refreshToken) return null;

    const refreshTokensMatch = await bcrypt.compare(
      providedRefreshToken,
      user.refreshToken,
    );

    return refreshTokensMatch ? user.toUserData() : null;
  }

  async login(user: UserData) {
    const tokens = await this.createAccessAndRefreshTokens(user.id, user.email);
    console.log(tokens.refresh_token);
    this.updateUserRefreshToken(user.id, tokens.refresh_token);
    return {
      ...user,
      ...tokens,
    };
  }

  async logout(user: UserData) {
    await this.usersService.updateUserRefreshTokenHash(user.id, null);
  }

  async refreshAccessToken(userData: UserData) {
    const tokens = await this.createAccessAndRefreshTokens(
      userData.id,
      userData.email,
    );
    await this.updateUserRefreshToken(userData.id, tokens.refresh_token);
    return tokens;
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
    const passwordHash = await bcrypt.hash(userCredentials.password, this.salt);

    const newUser = await this.usersService.createUser({
      ...userCredentials,
      password: passwordHash,
    });

    const { password, refreshToken, ...userData } = newUser;

    const tokens = await this.createAccessAndRefreshTokens(
      newUser.id,
      newUser.email,
    );
    await this.updateUserRefreshToken(newUser.id, tokens.refresh_token);
    return { ...userData, ...tokens };
  }

  private async createAccessAndRefreshTokens(userId: number, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({ sub: userId, email }),
      this.jwtService.signAsync(
        { sub: userId, email },
        { expiresIn: 60 * 60 * 24 * 7, secret: process.env.JWT_REFRESH_SECRET },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async updateUserRefreshToken(userId: number, refreshToken: string) {
    const refreshTokenHash = await bcrypt.hash(refreshToken, this.salt);
    await this.usersService.updateUserRefreshTokenHash(
      userId,
      refreshTokenHash,
    );
  }
}
