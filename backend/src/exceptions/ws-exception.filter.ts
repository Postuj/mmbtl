import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthorizedSocket } from 'src/auth/types';
import {
  WsBadRequestException,
  WsForbiddenException,
  WsNotFoundException,
  WsUnauthorizedException,
  WsUnknownException,
} from './ws.exception';

@Catch()
export class WsExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(WsExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const socket: AuthorizedSocket = host.switchToWs().getClient();

    if (exception instanceof UnauthorizedException) {
      const exceptionData = exception.getResponse();
      const wsException = new WsUnauthorizedException(
        exceptionData['message'] ?? 'Unauthorized',
      );
      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof BadRequestException) {
      const exceptionData = exception.getResponse();
      const wsException = new WsBadRequestException(
        exceptionData['message'] ?? 'Bad Request',
      );
      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof ForbiddenException) {
      const exceptionData = exception.getResponse();
      const wsException = new WsForbiddenException(
        exceptionData['message'] ?? 'Forbidden',
      );
      socket.emit('exception', wsException.getError());
      return;
    }

    if (exception instanceof NotFoundException) {
      const exceptionData = exception.getResponse();
      const wsException = new WsNotFoundException(
        exceptionData['message'] ?? 'Not Found',
      );
      socket.emit('exception', wsException.getError());
      return;
    }

    // const exceptionData = exception.getResponse();
    const wsException = new WsUnknownException();
    socket.emit('exception', wsException.getError());
  }
}
