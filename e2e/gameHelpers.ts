import { Page, expect } from "@playwright/test";

export const dropInColumn = async (page: Page, column: number) => {
  await page.getByTestId(`column-${column}`).click();
};

export const touchDropInColumn = async (page: Page, column: number) => {
  const token = page.getByRole("img", { name: /piece/i });
  const tokenBox = await token.boundingBox();
  const columnBox = await page.getByTestId(`column-${column}`).boundingBox();
  const boardBox = await page
    .getByRole("grid", { name: /connect four board/i })
    .boundingBox();
  if (!tokenBox || !columnBox || !boardBox) {
    throw new Error("Missing bounding boxes for touch drop");
  }
  const startX = tokenBox.x + tokenBox.width / 2;
  const startY = tokenBox.y + tokenBox.height / 2;
  const endX = columnBox.x + columnBox.width / 2;
  const endY = boardBox.y - 20;
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

export const playMoves = async (page: Page, moves: number[]) => {
  for (const column of moves) {
    await dropInColumn(page, column);
  }
};

export const playTouchMoves = async (page: Page, moves: number[]) => {
  for (const column of moves) {
    await touchDropInColumn(page, column);
  }
};

export const expectStatus = async (page: Page, text: string) => {
  await expect(page.getByTestId("game-status-message")).toHaveText(text);
};

export const startNewGame = async (page: Page) => {
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "New Game" }).click();
};
