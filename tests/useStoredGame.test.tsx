import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { useStoredGame } from "../src/hooks/useStoredGame";

const storageKey = "connect4-game";

describe("useStoredGame", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("loads the default game when localStorage is empty", () => {
    const { result } = renderHook(() => useStoredGame());
    expect(result.current.state.currentPlayer).toBe("Red");
  });

  it("persists state updates", () => {
    const { result } = renderHook(() => useStoredGame());
    act(() => {
      result.current.setState((prev) => ({
        ...prev,
        currentPlayer: "Yellow"
      }));
    });
    const stored = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    expect(stored.currentPlayer).toBe("Yellow");
  });
});
