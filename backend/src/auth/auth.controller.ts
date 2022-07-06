import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { User } from 'src/users/user.decorator';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RegisterDto } from './dto/RegisterDto';
import { Public } from 'src/common/public';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@User() user: UserEntity) {
    return this.authService.login(user);
  }

  @Public()
  @Post('signup')
  async singUp(@Body() registerDto: RegisterDto) {
    return this.authService.signUpLocal(registerDto);
  }
}
