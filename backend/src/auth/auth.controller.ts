import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/RegisterDto';
import { Public } from 'src/common/public';
import { JwtRefreshTokenAuthGuard } from './guards/jwtRefreshToken-auth.guard';
import { GetUser } from 'src/users/decorators/user.decorator';
import { UserData } from 'src/users/interfaces/userData.interface';
import GoogleTokenDto from './dto/GoogleTokenDto.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@GetUser() user: UserData) {
    return this.authService.login(user);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async singUp(@Body() registerDto: RegisterDto) {
    return this.authService.signUpLocal(registerDto);
  }

  @Public()
  @UseGuards(JwtRefreshTokenAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(@GetUser() user: UserData) {
    return this.authService.refreshAccessToken(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@GetUser() user: UserData) {
    return this.authService.logout(user);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('google')
  loginWithGoogle(@Body() tokenData: GoogleTokenDto) {
    return this.authService.loginWithGoogle(tokenData.token);
  }
}
