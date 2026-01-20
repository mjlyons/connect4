import { useCallback, useEffect, useRef, useState } from "react";
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
  const layoutRaf = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [snapColumn, setSnapColumn] = useState<number | null>(null);

  const updateLayout = useCallback(() => {
    if (layoutRaf.current !== null) {
      window.cancelAnimationFrame(layoutRaf.current);
    }
    layoutRaf.current = window.requestAnimationFrame(() => {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${height}px`
      );

      const board = boardRef.current;
      const frame = board?.parentElement;
      if (!board || !frame) return;
      const { width, height: frameHeight } = frame.getBoundingClientRect();
      const boardSize = Math.max(0, Math.min(width, frameHeight));
      const style = window.getComputedStyle(board);
      const gap = parseFloat(style.gap) || 0;
      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const paddingRight = parseFloat(style.paddingRight) || 0;
      const cellSize = (boardSize - paddingLeft - paddingRight - gap * 6) / 7;
      board.style.setProperty("--board-size", `${boardSize}px`);
      if (cellSize > 0) {
        board.style.setProperty("--cell-size", `${cellSize}px`);
      }
    });
  }, []);

  useEffect(() => {
    let observer: ResizeObserver | null = null;
    let observerRaf: number | null = null;

    const attachObserver = () => {
      if (observer) return;
      const frame = boardRef.current?.parentElement;
      if (!frame) return;
      observer = new ResizeObserver(() => updateLayout());
      observer.observe(frame);
    };

    updateLayout();
    attachObserver();
    observerRaf = window.requestAnimationFrame(attachObserver);
    window.addEventListener("resize", updateLayout);
    window.addEventListener("orientationchange", updateLayout);
    window.visualViewport?.addEventListener("resize", updateLayout);

    return () => {
      if (layoutRaf.current !== null) {
        window.cancelAnimationFrame(layoutRaf.current);
      }
      if (observerRaf !== null) {
        window.cancelAnimationFrame(observerRaf);
      }
      observer?.disconnect();
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("orientationchange", updateLayout);
      window.visualViewport?.removeEventListener("resize", updateLayout);
    };
  }, [updateLayout]);
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
  const finalizeDrag = useCallback(() => {
    if (snapColumn !== null) {
      handleDrop(snapColumn);
      return;
    }
    setDragging(false);
    setDragPosition(null);
    setSnapColumn(null);
  }, [handleDrop, snapColumn]);
  const handlePointerStart = useCallback(
    (point: { x: number; y: number }) => {
      setDragging(true);
      updateDragPosition(point);
    },
    [updateDragPosition]
  );
  const handlePointerMove = useCallback(
    (point: { x: number; y: number }) => {
      updateDragPosition(point);
    },
    [updateDragPosition]
  );
  const handlePointerEnd = useCallback(() => {
    finalizeDrag();
  }, [finalizeDrag]);
  const handleTouchEnd = useCallback(() => {
    finalizeDrag();
  }, [finalizeDrag]);
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
          onPointerStart={handlePointerStart}
          onPointerMove={handlePointerMove}
          onPointerEnd={handlePointerEnd}
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
