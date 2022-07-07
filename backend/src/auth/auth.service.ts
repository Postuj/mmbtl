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
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import { RegistrationMethod } from 'src/users/entities/registrationMethod.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);
  private readonly outhGoogleClient: Auth.OAuth2Client;
  private readonly salt: number;
  private readonly jwtRefreshSecret: string;
  private registrationMethods: {
    local: RegistrationMethod;
    goggle: RegistrationMethod;
  };

  constructor(
    @InjectRepository(RegistrationMethod)
    private readonly registrationMethodsRepo: Repository<RegistrationMethod>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.salt = parseInt(this.configService.get('SALT'));
    this.jwtRefreshSecret = this.configService.get('JWT_REFRESH_SECRET');
    const googleClientId = this.configService.get('GOOGLE_AUTH_CLIENT_ID');
    const googleClientSecret = this.configService.get(
      'GOOGLE_AUTH_CLIENT_SECRET',
    );
    this.outhGoogleClient = new google.auth.OAuth2(
      googleClientId,
      googleClientSecret,
    );
    this.initRegistrationMethods();
  }

  async validateUser(email: string, pass: string): Promise<UserData> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !user.password) return null;

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
    this.updateUserRefreshToken(user.id, tokens.refresh_token);
    return {
      ...user,
      ...tokens,
    };
  }

  async loginWithGoggle(token: string) {
    const tokenInfo = await this.outhGoogleClient.getTokenInfo(token);
    const email = tokenInfo.email;

    let user = await this.usersService.findOneByEmail(email);
    if (!user) {
      user = await this.registerUserWithGoggle(token);
    } else {
      if (user.registrationMethod !== this.registrationMethods.goggle)
        throw new ForbiddenException();
      const tokens = await this.createAccessAndRefreshTokens(
        user.id,
        user.email,
      );
      return {
        ...user.toUserData(),
        ...tokens,
      };
    }
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
    this.logger.log(`Registering user ${userCredentials.email} locally`);
    const passwordHash = await bcrypt.hash(userCredentials.password, this.salt);

    const newUser = await this.usersService.createUser(
      {
        ...userCredentials,
        password: passwordHash,
      },
      this.registrationMethods.local,
    );

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
        {
          expiresIn: 60 * 60 * 24 * 7,
          secret: this.jwtRefreshSecret,
        },
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

  private async registerUserWithGoggle(token: string) {
    const userInfo = await this.getUserInfoFromGoogleToken(token);
    this.logger.log(`Registering user ${userInfo.email} with google`);
    const user = await this.usersService.createUser(
      {
        username: userInfo.name || 'User',
        email: userInfo.email,
      },
      this.registrationMethods.goggle,
    );
    return user;
  }

  private async getUserInfoFromGoogleToken(token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;

    this.outhGoogleClient.setCredentials({
      access_token: token,
    });

    const userInfoResponse = await userInfoClient.get({
      auth: this.outhGoogleClient,
    });

    return userInfoResponse.data;
  }

  private async initRegistrationMethods() {
    const local = await this.registrationMethodsRepo.findOneBy({
      name: 'local',
    });
    const goggle = await this.registrationMethodsRepo.findOneBy({
      name: 'goggle',
    });
    this.registrationMethods = {
      local,
      goggle,
    };
  }
}
