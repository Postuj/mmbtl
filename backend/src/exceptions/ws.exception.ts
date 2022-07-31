import { WsException } from '@nestjs/websockets';

type WsExceptionType = 'Unauthorized' | 'BadRequest' | 'Forbidden' | 'NotFound' | 'Unknown' | 'InternalServerError';

export class WsTypedException extends WsException {
  readonly type: WsExceptionType;

  constructor(type: WsExceptionType, message: string | unknown) {
    super({
      type,
      message,
    });
    this.type = type;
  }
}

export class WsUnauthorizedException extends WsTypedException {
  constructor(message: string = 'Unauthorized') {
    super('Unauthorized', message);
  }
}

export class WsBadRequestException extends WsTypedException {
  constructor(message: string = 'Bad Request') {
    super('BadRequest', message);
  }
}

export class WsForbiddenException extends WsTypedException {
  constructor(message: string = 'Forbidden') {
    super('Forbidden', message);
  }
}

export class WsNotFoundException extends WsTypedException {
  constructor(message: string = 'Not Found') {
    super('NotFound', message);
  }
}

export class WsUnknownException extends WsTypedException {
  constructor(message: string = 'Unknown') {
    super('Unknown', message);
  }
}

export class WsInternalServerErrorException extends WsTypedException {
  constructor(message: string = 'InternalServerError') {
    super('InternalServerError', message);
  }
}
