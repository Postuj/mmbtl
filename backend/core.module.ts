import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    {
      ...JwtModule.registerAsync({
        useFactory: (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: 60 * 60 },
        }),
        inject: [ConfigService],
      }),
      global: true,
    },
  ],
  exports: [JwtModule],
})
export class CoreModule {}
