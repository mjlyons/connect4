import type { PointerEvent } from "react";
import { useEffect, useState } from "react";
import { Board, Player } from "../model/board";
import { CellView } from "./CellView";

type BoardViewProps = {
  board: Board;
  currentPlayer: Player;
  dragging: boolean;
  lastMove: { row: number; column: number } | null;
  onDropColumn: (column: number) => void;
};

export const BoardView = ({
  board,
  currentPlayer,
  dragging,
  lastMove,
  onDropColumn
}: BoardViewProps) => {
  const [hoverColumn, setHoverColumn] = useState<number | null>(null);

  useEffect(() => {
    if (!dragging) setHoverColumn(null);
  }, [dragging]);

  const handlePointerDrop = (
    event: PointerEvent<HTMLDivElement>,
    colIndex: number
  ) => {
    if (!dragging) return;
    if (event.pointerType !== "touch") return;
    event.preventDefault();
    onDropColumn(colIndex);
  };

  return (
    <div className="board" role="grid" aria-label="Connect Four board">
      {board[0].map((_, colIndex) => {
        const canDrop = !board[0][colIndex];
        const showPreview = dragging && hoverColumn === colIndex && canDrop;
        return (
          <div
            key={`column-${colIndex}`}
            className="board__column"
            role="button"
            tabIndex={0}
            aria-label={`Drop ${currentPlayer} piece in column ${colIndex + 1}`}
            data-testid={`column-${colIndex}`}
            onClick={() => onDropColumn(colIndex)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onDropColumn(colIndex);
              }
            }}
            onDragOver={(event) => {
              if (!dragging) return;
              event.preventDefault();
              if (canDrop) setHoverColumn(colIndex);
            }}
            onDragLeave={() => {
              if (hoverColumn === colIndex) setHoverColumn(null);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setHoverColumn(null);
              onDropColumn(colIndex);
            }}
            onPointerUp={(event) => handlePointerDrop(event, colIndex)}
            onPointerCancel={(event) => handlePointerDrop(event, colIndex)}
          >
            {showPreview && (
              <div
                className={`board__preview board__preview--${currentPlayer.toLowerCase()}`}
                aria-hidden="true"
              />
            )}
            {board.map((row, rowIndex) => (
              <CellView
                key={`cell-${rowIndex}-${colIndex}`}
                value={row[colIndex]}
                animate={
                  lastMove?.row === rowIndex && lastMove.column === colIndex
                }
                dropRows={rowIndex + 1}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
};
