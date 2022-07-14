import { HttpService } from "./HttpService";

export class GameService extends HttpService {
    constructor() {
        super("http://localhost:3001/game")
    }
}