export enum FunctionQuery {
  SUMMARIZE_ROUND = 'select * from summarize_round($1)',
  GET_SUBMITTED_GRADES_COUNT = 'select * from get_submitted_grades_count($1)',
  GET_GAME_RESULTS = 'select * from get_game_results($1)',
}
