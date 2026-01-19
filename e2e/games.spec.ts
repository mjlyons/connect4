import { test } from "@playwright/test";
import {
  expectStatus,
  playMoves,
  playTouchMoves,
  startNewGame
} from "./gameHelpers";

test.describe("connect four games", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const games = [
    {
      name: "red horizontal win",
      moves: [0, 0, 1, 1, 2, 2, 3],
      result: "Red Wins!"
    },
    {
      name: "yellow vertical win",
      moves: [0, 1, 0, 1, 2, 1, 3, 1],
      result: "Yellow Wins!"
    },
    {
      name: "red diagonal win",
      moves: [0, 0, 0, 1, 0, 0, 3, 1, 1, 2, 2],
      result: "Red Wins!"
    },
    {
      name: "yellow diagonal win",
      moves: [2, 3, 1, 2, 1, 1, 0, 0, 0, 0],
      result: "Yellow Wins!"
    },
    {
      name: "red vertical win",
      moves: [0, 1, 0, 1, 0, 1, 0],
      result: "Red Wins!"
    },
    {
      name: "yellow horizontal win",
      moves: [4, 0, 4, 1, 5, 2, 5, 3],
      result: "Yellow Wins!"
    },
    {
      name: "red edge vertical",
      moves: [6, 0, 6, 0, 6, 1, 6],
      result: "Red Wins!"
    },
    {
      name: "yellow diagonal alt",
      moves: [3, 0, 1, 1, 2, 4, 2, 2, 3, 5, 3, 3],
      result: "Yellow Wins!"
    },
    {
      name: "red vertical column 2",
      moves: [2, 0, 2, 1, 2, 1, 2],
      result: "Red Wins!"
    },
    {
      name: "yellow vertical column 5",
      moves: [0, 5, 0, 5, 1, 5, 2, 5],
      result: "Yellow Wins!"
    }
  ];

  for (const game of games) {
    test(game.name, async ({ page }) => {
      await playMoves(page, game.moves);
      await expectStatus(page, game.result);
      await startNewGame(page);
    });
  }

  test("touch interactions drop a token", async ({ page }) => {
    await playTouchMoves(page, [0]);
    await expectStatus(page, "Yellow's turn");
    await startNewGame(page);
  });
});
