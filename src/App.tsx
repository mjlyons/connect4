import { useCallback, useMemo, useState } from "react";
import { BoardView } from "./components/BoardView";
import { GameStatus } from "./components/GameStatus";
import { TokenTray } from "./components/TokenTray";
import { useStoredGame } from "./hooks/useStoredGame";
import { applyMove, isInProgress } from "./model/game";
import "./styles/app.css";
import "./styles/celebration.css";

export const App = () => {
  const { state, setState, reset } = useStoredGame();
  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
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
      setDragPosition(null);
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
      setDragPosition(null);
    },
    [handleDrop]
  );

  const handleTouchStart = useCallback((point: { x: number; y: number }) => {
    setDragging(true);
    setDragPosition(point);
  }, []);

  const handleTouchMove = useCallback((point: { x: number; y: number }) => {
    setDragPosition(point);
  }, []);

  const handleTouchEnd = useCallback(
    (point: { x: number; y: number }) => {
      handleTouchDrop(point);
    },
    [handleTouchDrop]
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
      {!state.winner && (
        <TokenTray
          player={state.currentPlayer}
          setDragging={setDragging}
          hideToken={Boolean(dragPosition)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      )}
      {dragPosition ? (
        <div
          className={`dragging-token dragging-token--${state.currentPlayer.toLowerCase()}`}
          style={{ left: dragPosition.x, top: dragPosition.y }}
          aria-hidden="true"
        />
      ) : null}
      <BoardView
        board={state.board}
        currentPlayer={state.currentPlayer}
        dragging={dragging}
        lastMove={state.lastMove}
        onDropColumn={handleDrop}
      />
    </div>
  );
};
