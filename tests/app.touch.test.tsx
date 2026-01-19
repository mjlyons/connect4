import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { App } from "../src/App";

describe("App touch play", () => {
  it("drops a token with touch pointer events", async () => {
    const { container } = render(<App />);

    const token = screen.getByRole("img", { name: /red piece/i });
    act(() => {
      fireEvent.touchStart(token);
    });

    const column = screen.getByTestId("column-0");
    let cleanupElementFromPoint = () => {};
    if (document.elementFromPoint) {
      const elementFromPoint = vi
        .spyOn(document, "elementFromPoint")
        .mockReturnValue(column);
      cleanupElementFromPoint = () => elementFromPoint.mockRestore();
    } else {
      Object.defineProperty(document, "elementFromPoint", {
        value: () => column,
        configurable: true
      });
      cleanupElementFromPoint = () => {
        delete (
          document as Document & {
            elementFromPoint?:
              | ((x: number, y: number) => Element | null)
              | null;
          }
        ).elementFromPoint;
      };
    }
    act(() => {
      fireEvent.touchEnd(token, {
        changedTouches: [{ clientX: 10, clientY: 10 }]
      });
    });

    expect(container.querySelectorAll(".cell--red")).toHaveLength(1);
    cleanupElementFromPoint();
  });
});
