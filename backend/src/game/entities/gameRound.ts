import { Meme } from "src/memes/entities/meme.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./game.entity";

@Entity('game_rounds')
export class GameRound {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Game, (game) => game.rounds)
    game: Game;

    @OneToMany(() => Meme, (meme) => meme.round)
    memes: Meme[];
}