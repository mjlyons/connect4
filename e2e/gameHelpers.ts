import { Page, TestInfo, expect } from "@playwright/test";

export const dropInColumn = async (page: Page, column: number) => {
  await page.getByTestId(`column-${column}`).click();
};

export const touchDropInColumn = async (page: Page, column: number) => {
  const token = page.getByRole("img", { name: /piece/i });
  const tokenBox = await token.boundingBox();
  const columnBox = await page.getByTestId(`column-${column}`).boundingBox();
  if (!tokenBox || !columnBox) {
    throw new Error("Missing bounding boxes for touch drop");
  }
  const startX = tokenBox.x + tokenBox.width / 2;
  const startY = tokenBox.y + tokenBox.height / 2;
  const endX = columnBox.x + columnBox.width / 2;
  const endY = columnBox.y + columnBox.height / 2;
  const identifier = 1;
  await token.dispatchEvent("touchstart", {
    touches: [{ identifier, clientX: startX, clientY: startY }]
  });
  await page.dispatchEvent("body", "touchmove", {
    touches: [{ identifier, clientX: endX, clientY: endY }]
  });
  await token.dispatchEvent("touchend", {
    changedTouches: [{ identifier, clientX: endX, clientY: endY }]
  });
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

export const playTouchMoves = async (
  page: Page,
  testInfo: TestInfo,
  moves: number[]
) => {
  for (const [index, column] of moves.entries()) {
    await touchDropInColumn(page, column);
    await page.screenshot({
      path: testInfo.outputPath(`touch-step-${index + 1}.png`),
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
