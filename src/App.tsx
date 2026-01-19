import { useCallback, useRef, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { BoardView } from "./components/BoardView";
import { GameStatus } from "./components/GameStatus";
import { TokenTray } from "./components/TokenTray";
import { useStoredGame } from "./hooks/useStoredGame";
import { applyMove, isInProgress } from "./model/game";
import "./styles/app.css";
import "./styles/celebration.css";

export const App = () => {
  const { state, setState, reset, undo, redo, canUndo, canRedo } =
    useStoredGame();
  const boardRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [snapColumn, setSnapColumn] = useState<number | null>(null);
  const handleDrop = useCallback(
    (column: number) => {
      setDragging(false);
      setDragPosition(null);
      setSnapColumn(null);
      setState((prev) => applyMove(prev, column));
    },
    [setState]
  );
  const updateDragPosition = useCallback(
    (point: { x: number; y: number }) => {
      const board = boardRef.current;
      if (!board) {
        setSnapColumn(null);
        setDragPosition(point);
        return;
      }
      const boardRect = board.getBoundingClientRect();
      const snapZoneHeight = 80;
      const tokenRadius = 30;
      const snapGap = 8;
      const isWithinX = point.x >= boardRect.left && point.x <= boardRect.right;
      const isWithinY =
        point.y >= boardRect.top - snapZoneHeight &&
        point.y <= boardRect.bottom;
      if (isWithinX && isWithinY) {
        const columns = Array.from(
          board.querySelectorAll<HTMLElement>('[data-testid^="column-"]')
        );
        const target = columns.find((column) => {
          const rect = column.getBoundingClientRect();
          return point.x >= rect.left && point.x <= rect.right;
        });
        const testId = target?.dataset.testid;
        const match = testId?.match(/column-(\d+)/);
        if (target && match) {
          const columnIndex = Number(match[1]);
          const canDrop = !state.board[0][columnIndex];
          if (canDrop) {
            const rect = target.getBoundingClientRect();
            setSnapColumn(columnIndex);
            setDragPosition({
              x: rect.left + rect.width / 2,
              y: boardRect.top - tokenRadius - snapGap
            });
            return;
          }
        }
      }
      setSnapColumn(null);
      setDragPosition(point);
    },
    [state.board]
  );
  const handleTouchStart = useCallback(
    (point: { x: number; y: number }) => {
      setDragging(true);
      updateDragPosition(point);
    },
    [updateDragPosition]
  );
  const handleTouchMove = useCallback(
    (point: { x: number; y: number }) => {
      updateDragPosition(point);
    },
    [updateDragPosition]
  );
  const handleTouchEnd = useCallback(() => {
    if (snapColumn !== null) {
      handleDrop(snapColumn);
      return;
    }
    setDragging(false);
    setDragPosition(null);
    setSnapColumn(null);
  }, [handleDrop, snapColumn]);
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
      <AppHeader
        onNewGame={handleNewGame}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />
      <GameStatus
        winner={state.winner}
        isDraw={state.isDraw}
        currentPlayer={state.currentPlayer}
      />
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
          className={`dragging-token dragging-token--${state.currentPlayer.toLowerCase()}${
            snapColumn !== null ? " dragging-token--snap" : ""
          }`}
          style={{ left: dragPosition.x, top: dragPosition.y }}
          aria-hidden="true"
        />
      ) : null}
      <div className="board-frame">
        <BoardView
          board={state.board}
          currentPlayer={state.currentPlayer}
          dragging={dragging}
          lastMove={state.lastMove}
          boardRef={boardRef}
          onDropColumn={handleDrop}
        />
      </div>
    </div>
  );
};
