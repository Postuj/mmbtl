import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectEntityManager } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { FunctionQuery } from './queries';

@Injectable()
export class DbService {
  private readonly logger = new Logger(DbService.name);
  private readonly functionsFilePath = '../../../sql/create_functions.sql';
  constructor(
    @InjectEntityManager('default') private readonly entityManager: DataSource,
  ) {
    // this.createFunctions();
  }

  public async excecuteQuery(query: FunctionQuery, ...args) {
    try {
      const result = await this.entityManager.query(query, args);
      return result;
    } catch (error) {
      console.error(error);
      this.logger.error('Encountered an error while executing query: ' + query);
    }
  }

  private async createFunctions() {
    this.logger.log('Initializing SQL functions');
    try {
      const createFunctionsCommand = this.readQueryFromSqlFile(
        this.functionsFilePath,
      );
      console.log(FunctionQuery.GET_GAME_RESULTS);
      console.log(createFunctionsCommand);
      await this.entityManager.query(createFunctionsCommand);
      this.logger.log('SQL functions initialized');
    } catch {
      this.logger.error(
        'Encountered an error while initializing SQL functions',
      );
    }
  }

  private readQueryFromSqlFile(filePath: string) {
    this.logger.log('Reading sql query from: ' + filePath);
    return fs
      .readFileSync(path.join(__dirname, filePath))
      .toString()
      .replace(/\r?\n|\r/g, ' ');
  }
}
