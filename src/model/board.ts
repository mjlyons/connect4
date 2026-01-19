export type Player = "Red" | "Yellow";
export type Cell = Player | null;
export type Board = Cell[][];

export const BOARD_SIZE = 7;
export const CONNECT_TARGET = 4;

export const createBoard = (): Board =>
  Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );

export const dropPiece = (board: Board, column: number, player: Player) => {
  for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
    if (!board[row][column]) {
      const next = board.map((rowCells) => [...rowCells]);
      next[row][column] = player;
      return { board: next, row };
    }
  }
  return null;
};

const directions = [
  { row: 0, col: 1 },
  { row: 1, col: 0 },
  { row: 1, col: 1 },
  { row: 1, col: -1 }
];

const inBounds = (row: number, col: number) =>
  row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;

export const checkWinner = (board: Board): Player | null => {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = board[row][col];
      if (!cell) continue;
      for (const dir of directions) {
        let count = 1;
        for (let i = 1; i < CONNECT_TARGET; i += 1) {
          const r = row + dir.row * i;
          const c = col + dir.col * i;
          if (!inBounds(r, c) || board[r][c] !== cell) break;
          count += 1;
        }
        if (count >= CONNECT_TARGET) return cell;
      }
    }
  }
  return null;
};

export const isBoardFull = (board: Board) =>
  board.every((row) => row.every((cell) => cell));

export const hasAnyMoves = (board: Board) =>
  board.some((row) => row.some((cell) => cell));
