import {
  Board,
  Player,
  checkWinner,
  createBoard,
  dropPiece,
  hasAnyMoves,
  isBoardFull
} from "./board";

export type GameState = {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  lastMove: { row: number; column: number } | null;
};

export const createGame = (): GameState => ({
  board: createBoard(),
  currentPlayer: "Red",
  winner: null,
  isDraw: false,
  lastMove: null
});

export const applyMove = (state: GameState, column: number): GameState => {
  if (state.winner || state.isDraw) return state;
  const result = dropPiece(state.board, column, state.currentPlayer);
  if (!result) return state;
  const winner = checkWinner(result.board);
  const isDraw = !winner && isBoardFull(result.board);
  return {
    board: result.board,
    currentPlayer: state.currentPlayer === "Red" ? "Yellow" : "Red",
    winner,
    isDraw,
    lastMove: { row: result.row, column }
  };
};

export const isInProgress = (state: GameState) =>
  hasAnyMoves(state.board) && !state.winner && !state.isDraw;
