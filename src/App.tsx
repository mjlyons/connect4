import { useCallback, useMemo, useState } from "react";
import { BoardView } from "./components/BoardView";
import { GameStatus } from "./components/GameStatus";
import { TokenTray } from "./components/TokenTray";
import { useStoredGame } from "./hooks/useStoredGame";
import { applyMove, isInProgress } from "./model/game";
import "./styles/app.css";

export const App = () => {
  const { state, setState, reset } = useStoredGame();
  const [dragging, setDragging] = useState(false);
  const status = useMemo(
    () => ({
      winner: state.winner,
      isDraw: state.isDraw,
      currentPlayer: state.currentPlayer
    }),
    [state]
  );

  const handleDrop = useCallback(
    (column: number) => {
      setDragging(false);
      setState((prev) => applyMove(prev, column));
    },
    [setState]
  );

  const handleTouchDrop = useCallback(
    (point: { x: number; y: number }) => {
      const target = document.elementFromPoint(point.x, point.y);
      const column = target?.closest<HTMLElement>('[data-testid^="column-"]');
      const testId = column?.dataset.testid;
      const match = testId?.match(/column-(\d+)/);
      if (match) {
        handleDrop(Number(match[1]));
        return;
      }
      setDragging(false);
    },
    [handleDrop]
  );

  const handleNewGame = () => {
    if (isInProgress(state)) {
      const shouldReset = window.confirm(
        "Start a new game? Your current progress will be lost."
      );
      if (!shouldReset) return;
    }
    reset();
  };

  return (
    <div className="app">
      <header className="app__header">
        <h1>Connect Four</h1>
        <button className="app__button" onClick={handleNewGame}>
          New Game
        </button>
      </header>
      <GameStatus {...status} />
      <TokenTray
        player={state.currentPlayer}
        setDragging={setDragging}
        onTouchDrop={handleTouchDrop}
      />
      <BoardView
        board={state.board}
        currentPlayer={state.currentPlayer}
        dragging={dragging}
        onDropColumn={handleDrop}
      />
    </div>
  );
};
