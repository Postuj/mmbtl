import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DbService } from 'src/db/db.service';
import { FunctionQuery } from 'src/db/queries';
import { MemesService } from 'src/memes/memes.service';
import { UserData } from 'src/users/interfaces/userData.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { SubmitMemeDto } from './dto/SubmitMemeDto.dto';
import { SubmitMemeGradeDto } from './dto/SubmitMemeGradeDto.dto';
import { Game, GameStatus } from './entities/game.entity';
import { GameRound, RoundStatus } from './entities/gameRound.entity';
import { GameRepository } from './repos/game.repository';
import { PlayerRepository } from './repos/player.repository';
import { PlayerResult } from './types';

@Injectable()
export class RoundService {
  private readonly logger = new Logger(RoundService.name);
  constructor(
    @InjectRepository(GameRound)
    private readonly roundRepo: Repository<GameRound>,
    private readonly gameRepo: GameRepository,
    private readonly playerRepo: PlayerRepository,
    private readonly dbService: DbService,
    private readonly memeService: MemesService,
    private readonly userService: UsersService,
  ) {}

  public async nextRound(game: Game) {
    this.logger.debug(`[Game ${game.id}] Starting next round`);

    const previousMemesIds = game.rounds.map((r) => r.templateId);
    const round = await this.createRound(
      game.id,
      game.rounds.length + 1,
      previousMemesIds,
    );
    game.rounds.push(round);
    await this.gameRepo.save(game);
    return round;
  }

  public async startGrading(game: Game, round: GameRound) {
    this.logger.debug(
      `[Game ${game.id}] (Round ${round.index}) Starting round grading`,
    );
    round.status = RoundStatus.GRADING;
    await this.roundRepo.save(round);
    return { memes: round.memes, gameId: game.id };
  }

  public async summarizeRound(game: Game, round: GameRound) {
    this.logger.debug(
      `[Game ${game.id}] (Round ${round.index}) Summarizing round`,
    );
    round.status = RoundStatus.FINISHED;
    await this.roundRepo.save(round);
    const roundResults = await this.getRoundResults(round.id);
    const finished = game.maxRounds === round.index;
    // ToDo: Check if last round
    return { game, roundResults, finished };
  }

  public async createRound(
    gameId: number,
    roundIndex: number,
    previousMemesIds: number[] = [],
    memeId?: number,
  ) {
    this.logger.debug(`[Game ${gameId}] Creating round: ${roundIndex}`);
    const memeTemplate = memeId
      ? await this.memeService.getMemeTemplateById(memeId)
      : await this.memeService.getRandomMemeTemplate(previousMemesIds);

    this.logger.debug(
      `[Game ${gameId}] (Round ${roundIndex}) Creted round, meme template: ${memeTemplate.name} (${memeTemplate.id})`,
    );
    return this.roundRepo.create({
      index: roundIndex,
      game: { id: gameId },
      template: memeTemplate,
    });
  }

  public async handleMemeSubmit(user: UserData, submittedMeme: SubmitMemeDto) {
    const { game, round, player } = await this.canUserSubmitMeme(
      user,
      submittedMeme,
    );
    this.logger.debug(
      `[Game ${game.id}] (Round ${round.index}) User ${user.email} has submitted a meme`,
    );

    const meme = await this.memeService.createMeme(
      user,
      player.id,
      submittedMeme,
      round.id,
    );
    round.memes.push(meme);

    const hasEveryoneSubmitted = await this.checkIfEveryoneSubmittedMeme(
      game,
      round,
    );
    if (hasEveryoneSubmitted) return await this.startGrading(game, round);
    else return { memes: null, gameId: null };
  }

  public async handleMemeGradeSubmit(
    user: UserData,
    submittedMemeGrade: SubmitMemeGradeDto,
  ) {
    const { game, round, player, memeToGrade } =
      await this.canUserSubmitMemeGrade(user, submittedMemeGrade);

    this.logger.debug(
      `[Game ${game.id}] (Round ${round.index}) User ${user.email} has graded user ${memeToGrade.createdById} meme to: ${submittedMemeGrade.score}`,
    );

    const grade = await this.memeService.gradeMeme(
      memeToGrade.id,
      user.id,
      player.id,
      submittedMemeGrade.score,
    );
    memeToGrade.grades.push(grade);

    const hasEveryoneSubmitted = await this.checkIfEveryoneSubmittedMemeGrade(
      game,
      round,
    );

    return hasEveryoneSubmitted
      ? await this.summarizeRound(game, round)
      : { roundResults: null, game: null, finished: false };
  }

  private async canUserSubmitAnything(user: UserData) {
    const userGame = await this.userService.getUserCurrentGame(user.id);
    if (!userGame) throw new ForbiddenException('You are not in game');
    if (userGame.status !== GameStatus.RUNNING)
      throw new ForbiddenException('Game is not RUNNING');
      
    const game = await this.gameRepo.getOneById(userGame.id, {
      withRounds: true,
      withPlayers: true,
    });

    const round = game.rounds.sort((g1, g2) => g2.index - g1.index)[0];
    if (!round) throw new ForbiddenException('Round does not exist');
    const player = await this.playerRepo.getPlayerByUserId(user.id, game.id);
    if (!player) throw new NotFoundException('Player not found');
    return { game, round, player };
  }

  private async canUserSubmitMeme(
    user: UserData,
    submittedMeme: SubmitMemeDto,
  ) {
    const { game, round, player } = await this.canUserSubmitAnything(user);
    if (round.status !== RoundStatus.RUNNING)
      throw new ForbiddenException('This round has already ENDED');
    if (round.template.id !== submittedMeme.templateId)
      throw new ForbiddenException('Your meme template id does not match');

    const previousMeme = round.memes.find((m) => m.createdById === user.id);
    if (previousMeme)
      throw new ForbiddenException('You already submitted a meme');

    return { game, round, player };
  }

  private async canUserSubmitMemeGrade(
    user: UserData,
    submittedMemeGrade: SubmitMemeGradeDto,
  ) {
    const { game, round, player } = await this.canUserSubmitAnything(user);
    if (round.status !== RoundStatus.GRADING)
      throw new ForbiddenException('This round has already ENDED');
    const memeToGrade = await this.memeService.getMemeById(
      submittedMemeGrade.memeId,
      { withGrades: true },
    );
    if (!memeToGrade) throw new NotFoundException('Meme not found');
    if (memeToGrade.createdById === user.id)
      throw new ForbiddenException('You cannot grade your own meme');
    const previosGrade = memeToGrade.grades.find(
      (grade) => grade.createdById === user.id,
    );
    if (previosGrade)
      throw new ForbiddenException('You already graded this meme');
    if (memeToGrade.roundId !== round.id)
      throw new ForbiddenException('This meme is not from your current round');
    return { game, round, player, memeToGrade };
  }

  private async checkIfEveryoneSubmittedMeme(game: Game, round: GameRound) {
    const playersIds = round.memes.map((m) => m.createdById);
    for (let i = 0; i < game.players.length; i++) {
      const player = game.players[i];
      const hasPlayerSubmitted = playersIds.includes(player.userId);
      if (!hasPlayerSubmitted) return false;
    }

    this.logger.debug(
      `[Game ${game.id}] (Round ${round.index}) Everybody has submitted a meme`,
    );
    return true;
  }

  private async checkIfEveryoneSubmittedMemeGrade(
    game: Game,
    round: GameRound,
  ) {
    const playersCount = game.players.length;
    const requiredGrades = playersCount * (playersCount - 1);
    const submittedMemeGradesCountRaw = await this.dbService.excecuteQuery(
      FunctionQuery.GET_SUBMITTED_GRADES_COUNT,
      round.id,
    );
    const submittedMemeGradesCount = submittedMemeGradesCountRaw[0].count;

    this.logger.debug(
      `[Game ${game.id} (Round ${round.index})] Submitted meme grades: ${submittedMemeGradesCount} / ${requiredGrades}`,
    );

    if (submittedMemeGradesCount < requiredGrades) return false;

    this.logger.debug(
      `[Game ${game.id}] (Round ${round.index}) Everybody has submitted a meme grade`,
    );

    return true;
  }

  private async getRoundResults(roundId: number) {
    const results: PlayerResult[] = await this.dbService.excecuteQuery(
      FunctionQuery.SUMMARIZE_ROUND,
      roundId,
    );
    return results;
  }
}
