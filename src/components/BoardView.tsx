import type { PointerEvent, TouchEvent } from "react";
import { Board, Player } from "../model/board";
import { CellView } from "./CellView";

type BoardViewProps = {
  board: Board;
  currentPlayer: Player;
  dragging: boolean;
  onDropColumn: (column: number) => void;
};

export const BoardView = ({
  board,
  currentPlayer,
  dragging,
  onDropColumn
}: BoardViewProps) => {
  const handlePointerDrop = (
    event: PointerEvent<HTMLDivElement>,
    colIndex: number
  ) => {
    if (!dragging) return;
    if (event.pointerType !== "touch") return;
    event.preventDefault();
    onDropColumn(colIndex);
  };

  const handleTouchDrop = (
    event: TouchEvent<HTMLDivElement>,
    colIndex: number
  ) => {
    if (!dragging) return;
    event.preventDefault();
    onDropColumn(colIndex);
  };
  return (
    <div className="board" role="grid" aria-label="Connect Four board">
      {board[0].map((_, colIndex) => (
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
            if (dragging) event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();
            onDropColumn(colIndex);
          }}
          onPointerUp={(event) => handlePointerDrop(event, colIndex)}
          onPointerCancel={(event) => handlePointerDrop(event, colIndex)}
          onTouchEnd={(event) => handleTouchDrop(event, colIndex)}
        >
          {board.map((row, rowIndex) => (
            <CellView
              key={`cell-${rowIndex}-${colIndex}`}
              value={row[colIndex]}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
