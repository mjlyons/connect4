import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/App";

describe("App touch play", () => {
  it("drops a token with touch pointer events", async () => {
    const { container } = render(<App />);

    const token = screen.getByRole("img", { name: /red piece/i });
    act(() => {
      fireEvent.touchStart(token, {
        touches: [{ clientX: 12, clientY: 14 }]
      });
    });

    expect(container.querySelector(".dragging-token")).not.toBeNull();

    const board = screen.getByRole("grid", { name: /connect four board/i });
    vi.spyOn(board, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 700,
      top: 200,
      bottom: 900,
      width: 700,
      height: 700,
      x: 0,
      y: 200,
      toJSON: () => ""
    });
    const column = screen.getByTestId("column-0");
    vi.spyOn(column, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 100,
      top: 200,
      bottom: 900,
      width: 100,
      height: 700,
      x: 0,
      y: 200,
      toJSON: () => ""
    });
    act(() => {
      fireEvent.touchMove(token, {
        touches: [{ clientX: 50, clientY: 180 }]
      });
    });
    act(() => {
      fireEvent.touchEnd(token, {
        changedTouches: [{ clientX: 50, clientY: 180 }]
      });
    });

    expect(container.querySelectorAll(".cell--red")).toHaveLength(1);
    expect(container.querySelector(".dragging-token")).toBeNull();
  });
});
