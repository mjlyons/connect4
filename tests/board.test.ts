import { describe, expect, it } from "vitest";
import {
  BOARD_SIZE,
  checkWinner,
  createBoard,
  dropPiece,
  isBoardFull
} from "../src/model/board";

const fillBoard = (board: ReturnType<typeof createBoard>) => {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      board[row][col] = (row + col) % 2 === 0 ? "Red" : "Yellow";
    }
  }
  return board;
};

describe("board model", () => {
  it("creates a 7x7 board", () => {
    const board = createBoard();
    expect(board).toHaveLength(BOARD_SIZE);
    board.forEach((row) => expect(row).toHaveLength(BOARD_SIZE));
  });

  it("drops a piece into the lowest available row", () => {
    const board = createBoard();
    const firstDrop = dropPiece(board, 3, "Red");
    expect(firstDrop?.row).toBe(BOARD_SIZE - 1);
    const secondDrop = dropPiece(firstDrop?.board ?? board, 3, "Yellow");
    expect(secondDrop?.row).toBe(BOARD_SIZE - 2);
  });

  it("detects a horizontal win", () => {
    const board = createBoard();
    for (let col = 0; col < 4; col += 1) {
      board[BOARD_SIZE - 1][col] = "Red";
    }
    expect(checkWinner(board)).toBe("Red");
  });

  it("detects a diagonal win", () => {
    const board = createBoard();
    board[6][0] = "Yellow";
    board[5][1] = "Yellow";
    board[4][2] = "Yellow";
    board[3][3] = "Yellow";
    expect(checkWinner(board)).toBe("Yellow");
  });

  it("detects a full board", () => {
    const board = fillBoard(createBoard());
    expect(isBoardFull(board)).toBe(true);
  });
});
