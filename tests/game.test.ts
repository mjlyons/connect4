import { describe, expect, it } from "vitest";
import { applyMove, createGame } from "../src/model/game";

const dropMoves = (columns: number[]) =>
  columns.reduce((state, column) => applyMove(state, column), createGame());

describe("game model", () => {
  it("starts with Red", () => {
    const game = createGame();
    expect(game.currentPlayer).toBe("Red");
  });

  it("alternates players after a move", () => {
    const game = applyMove(createGame(), 0);
    expect(game.currentPlayer).toBe("Yellow");
  });

  it("blocks moves after a win", () => {
    const winningGame = dropMoves([0, 0, 1, 1, 2, 2, 3]);
    expect(winningGame.winner).toBe("Red");
    const afterWin = applyMove(winningGame, 4);
    expect(afterWin).toEqual(winningGame);
  });

  it("identifies a draw", () => {
    const game = dropMoves([
      0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 1, 0, 3, 2,
      5, 4, 0, 6, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6, 0, 1, 2, 3, 4, 5, 6
    ]);
    expect(game.isDraw).toBe(true);
  });
});
