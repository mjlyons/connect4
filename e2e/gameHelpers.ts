import { Page, TestInfo, expect } from "@playwright/test";

export const dropInColumn = async (page: Page, column: number) => {
  await page.getByTestId(`column-${column}`).click();
};

export const playMoves = async (
  page: Page,
  testInfo: TestInfo,
  moves: number[]
) => {
  for (const [index, column] of moves.entries()) {
    await dropInColumn(page, column);
    await page.screenshot({
      path: testInfo.outputPath(`step-${index + 1}.png`),
      fullPage: true
    });
  }
};

export const expectStatus = async (page: Page, text: string) => {
  await expect(page.getByTestId("game-status-message")).toHaveText(text);
};

export const startNewGame = async (page: Page) => {
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "New Game" }).click();
};
