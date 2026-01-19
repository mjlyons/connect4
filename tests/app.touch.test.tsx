import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";

describe("App touch play", () => {
  it("drops a token with touch pointer events", async () => {
    const { container } = render(<App />);

    const token = screen.getByRole("img", { name: /red piece/i });
    act(() => {
      fireEvent.touchStart(token);
    });

    const column = screen.getByTestId("column-0");
    act(() => {
      fireEvent.touchEnd(column);
    });

    expect(container.querySelectorAll(".cell--red")).toHaveLength(1);
  });
});
