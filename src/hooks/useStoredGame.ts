import { useEffect, useState } from "react";
import { GameState, createGame } from "../model/game";

const STORAGE_KEY = "connect4-game";

type StoredHistory = {
  past: GameState[];
  present: GameState;
  future: GameState[];
};

const normalizeGame = (data?: Partial<GameState>): GameState => ({
  ...createGame(),
  ...data,
  lastMove: data?.lastMove ?? null
});

const loadStoredGame = (): StoredHistory => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { past: [], present: createGame(), future: [] };
  }
  try {
    const parsed = JSON.parse(raw) as
      | StoredHistory
      | (GameState & { past?: GameState[]; future?: GameState[] });
    if ("present" in parsed) {
      return {
        past: (parsed.past ?? []).map((entry) => normalizeGame(entry)),
        present: normalizeGame(parsed.present),
        future: (parsed.future ?? []).map((entry) => normalizeGame(entry))
      };
    }
    if (!parsed.board || !parsed.currentPlayer) {
      return { past: [], present: createGame(), future: [] };
    }
    return { past: [], present: normalizeGame(parsed), future: [] };
  } catch {
    return { past: [], present: createGame(), future: [] };
  }
};

export const useStoredGame = () => {
  const [history, setHistory] = useState<StoredHistory>(() => loadStoredGame());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const setState = (updater: (prev: GameState) => GameState) => {
    setHistory((current) => {
      const next = updater(current.present);
      if (next === current.present) return current;
      return {
        past: [...current.past, current.present],
        present: next,
        future: []
      };
    });
  };

  const reset = () =>
    setHistory({ past: [], present: createGame(), future: [] });

  const undo = () => {
    setHistory((current) => {
      if (current.past.length === 0) return current;
      const previous = current.past[current.past.length - 1];
      return {
        past: current.past.slice(0, -1),
        present: previous,
        future: [current.present, ...current.future]
      };
    });
  };

  const redo = () => {
    setHistory((current) => {
      if (current.future.length === 0) return current;
      const next = current.future[0];
      return {
        past: [...current.past, current.present],
        present: next,
        future: current.future.slice(1)
      };
    });
  };

  return {
    state: history.present,
    setState,
    reset,
    undo,
    redo,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0
  };
};
