import { NotFoundException } from "@nestjs/common";

export class GameNotFoundException extends NotFoundException {
    constructor(message: string = 'Game not found') {
        super('GameNotFound', message);
      }
}