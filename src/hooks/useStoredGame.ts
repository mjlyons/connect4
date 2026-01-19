import { useEffect, useState } from "react";
import { GameState, createGame } from "../model/game";

const STORAGE_KEY = "connect4-game";

const loadStoredGame = (): GameState => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createGame();
  try {
    const parsed = JSON.parse(raw) as GameState;
    if (!parsed.board || !parsed.currentPlayer) return createGame();
    return { ...createGame(), ...parsed, lastMove: parsed.lastMove ?? null };
  } catch {
    return createGame();
  }
};

export const useStoredGame = () => {
  const [state, setState] = useState<GameState>(() => loadStoredGame());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const reset = () => setState(createGame());

  return { state, setState, reset };
};
