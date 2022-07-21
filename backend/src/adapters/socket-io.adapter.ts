import { ForbiddenException, INestApplicationContext, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server } from 'socket.io';
import { AuthorizedSocket } from 'src/auth/types';
import { UsersService } from 'src/users/users.service';

export class SocketIOAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIOAdapter.name);
  constructor(private readonly app: INestApplicationContext) {
    super(app);
  }

  createIOServer(port: number, options?: any): any {
    const jwtService = this.app.get(JwtService);
    const usersService = this.app.get(UsersService);
    const server: Server = super.createIOServer(port, options);

    server
      .of('game')
      .use(createAuthMiddleware(jwtService, usersService, this.logger));

    return server;
  }
}

const createAuthMiddleware =
  (jwtService: JwtService, usersService: UsersService, logger: Logger) =>
  async (socket: AuthorizedSocket, next) => {
    const token = socket.handshake.headers.authorization.split(' ')[1].trim();

    logger.debug(`Validating ${socket.id} token before connect`);

    try {
      const payload = await jwtService.verifyAsync(token);
      const user = await usersService.findOneById(payload.sub);
      if(!user) throw new UnauthorizedException();
      socket.user = user.toUserData();
      next();
    } catch {
      next(new UnauthorizedException());
    }
  };
