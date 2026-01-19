import { test } from "@playwright/test";
import { expectStatus, playMoves, startNewGame } from "./gameHelpers";

test.describe("connect four games", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  const games = [
    {
      name: "red horizontal win",
      moves: [0, 0, 1, 1, 2, 2, 3],
      result: "Red wins!"
    },
    {
      name: "yellow vertical win",
      moves: [0, 1, 0, 1, 2, 1, 3, 1],
      result: "Yellow wins!"
    },
    {
      name: "red diagonal win",
      moves: [0, 0, 0, 1, 0, 0, 3, 1, 1, 2, 2],
      result: "Red wins!"
    },
    {
      name: "yellow diagonal win",
      moves: [2, 3, 1, 2, 1, 1, 0, 0, 0, 0],
      result: "Yellow wins!"
    },
    {
      name: "red vertical win",
      moves: [0, 1, 0, 1, 0, 1, 0],
      result: "Red wins!"
    },
    {
      name: "yellow horizontal win",
      moves: [4, 0, 4, 1, 5, 2, 5, 3],
      result: "Yellow wins!"
    },
    {
      name: "red edge vertical",
      moves: [6, 0, 6, 0, 6, 1, 6],
      result: "Red wins!"
    },
    {
      name: "yellow diagonal alt",
      moves: [3, 0, 1, 1, 2, 4, 2, 2, 3, 5, 3, 3],
      result: "Yellow wins!"
    },
    {
      name: "red vertical column 2",
      moves: [2, 0, 2, 1, 2, 1, 2],
      result: "Red wins!"
    },
    {
      name: "yellow vertical column 5",
      moves: [0, 5, 0, 5, 1, 5, 2, 5],
      result: "Yellow wins!"
    }
  ];

  for (const game of games) {
    test(game.name, async ({ page }, testInfo) => {
      await playMoves(page, testInfo, game.moves);
      await expectStatus(page, game.result);
      await startNewGame(page);
    });
  }
});
